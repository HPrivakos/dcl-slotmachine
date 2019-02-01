# Slot machine



### Provably fair
The slot machine have provably fair, to verify the result use
sha256(serverSeed + clientSeed)
take the 6 first hex characters, convert them to int by group of two and take the last number, three times

example:

Server Seed                             |   Client Seed
5400cb49dd5b8b34fdcad2ecfe9a9ece        |   VvE9yQa4A86emf2Q

sha256(5400cb49dd5b8b34fdcad2ecfe9a9eceVvE9yQa4A86emf2Q) =
3424a8db843d1a41d748138037f19c876774db814809f81797f395171b7f621f

34      24      a8
5(2)    3(6)    16(8)

Result : 268
