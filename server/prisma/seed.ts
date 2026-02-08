import { PrismaClient, GroupCategory } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create test users
  const passwordHash = await bcrypt.hash('password123', 12);

  const users = await Promise.all(
    [
      { email: 'alice@test.com', displayName: 'Alice Johnson' },
      { email: 'bob@test.com', displayName: 'Bob Smith' },
      { email: 'carol@test.com', displayName: 'Carol Williams' },
      { email: 'dave@test.com', displayName: 'Dave Brown' },
      { email: 'eve@test.com', displayName: 'Eve Davis' },
    ].map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: { ...u, passwordHash },
      })
    )
  );

  console.log(`Created ${users.length} users`);

  // Create groups
  const groups = await Promise.all(
    [
      { name: 'CS 101 - Section A', category: 'academic' as GroupCategory, description: 'Intro to Computer Science' },
      { name: 'Dorm Hall B - Floor 3', category: 'housing' as GroupCategory, description: 'Third floor residents' },
      { name: 'Study Group Alpha', category: 'study' as GroupCategory, description: 'Evening study sessions' },
      { name: 'Photography Club', category: 'club' as GroupCategory, description: 'Campus photography enthusiasts' },
      { name: 'Intramural Soccer', category: 'sports' as GroupCategory, description: 'Casual soccer games' },
    ].map((g) =>
      prisma.group.upsert({
        where: { inviteCode: g.name.toLowerCase().replace(/\s+/g, '-') },
        update: {},
        create: { ...g, inviteCode: g.name.toLowerCase().replace(/\s+/g, '-') },
      })
    )
  );

  console.log(`Created ${groups.length} groups`);

  // Add all users to the first group, 3 users to others
  const memberships = [
    // All users in CS 101
    ...users.map((u) => ({ userId: u.id, groupId: groups[0].id })),
    // First 3 users in Dorm Hall
    ...users.slice(0, 3).map((u) => ({ userId: u.id, groupId: groups[1].id })),
    // Last 3 users in Study Group
    ...users.slice(2, 5).map((u) => ({ userId: u.id, groupId: groups[2].id })),
  ];

  for (const m of memberships) {
    await prisma.groupMember.upsert({
      where: { userId_groupId: { userId: m.userId, groupId: m.groupId } },
      update: {},
      create: m,
    });
  }

  // Update member counts
  for (const group of groups) {
    const count = await prisma.groupMember.count({ where: { groupId: group.id } });
    await prisma.group.update({
      where: { id: group.id },
      data: { memberCount: count },
    });
  }

  console.log('Added group memberships');

  // Create notification preferences for all users
  for (const user of users) {
    await prisma.notificationPreference.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });
  }

  console.log('Created notification preferences');
  console.log('Seed complete!');
  console.log('\nTest credentials:');
  console.log('  Email: alice@test.com');
  console.log('  Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
