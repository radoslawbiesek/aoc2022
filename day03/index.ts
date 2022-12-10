const LETTERS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

const Priority: Record<string, number> = [
  ...LETTERS,
  ...LETTERS.map((l) => l.toUpperCase()),
].reduce((acc, letter, index) => ({ ...acc, [letter]: index + 1 }), {});

function splitCompartments(rucksack: string): [string, string] {
  const firstHalf = rucksack.substring(0, rucksack.length / 2);
  const secondHalf = rucksack.substring(rucksack.length / 2);

  return [firstHalf, secondHalf];
}

function splitItems(compartment: string): string[] {
  return compartment.split('');
}

function splitGroups(list: string[]): string[][] {
  let groupList: string[][] = [];
  const ELVES_IN_GROUP = 3;
  list.forEach((rucksack, index) => {
    if (index % ELVES_IN_GROUP === 0) {
      groupList.push([]);
    }

    groupList[groupList.length - 1].push(rucksack);
  });

  return groupList;
}

function getDoubledItemsList(list: string[]): string[] {
  let doubledItems: string[] = [];
  list.forEach((rucksack) => {
    let rucksackDoubledItems: string[] = [];

    const compartment1 = splitItems(splitCompartments(rucksack)[0]);
    const compartment2 = splitItems(splitCompartments(rucksack)[1]);

    compartment1.forEach((item) => {
      if (compartment2.includes(item) && !rucksackDoubledItems.includes(item)) {
        rucksackDoubledItems.push(item);
      }
    });

    doubledItems.push(...rucksackDoubledItems);
  });

  return doubledItems;
}

function getBadgesList(list: string[]): string[] {
  const groupedList = splitGroups(list);

  let badges: string[] = [];

  groupedList.forEach((groupList) => {
    const groupBadges: string[] = [];

    const [largestGroup, ...rest] = groupList
      .sort((a, b) => b.length - a.length)
      .map((g) => g.split(''));

    largestGroup.forEach((badge) => {
      if (
        rest.every((group) => group.includes(badge)) &&
        !groupBadges.includes(badge)
      ) {
        groupBadges.push(badge);
      }
    });

    badges.push(...groupBadges);
  });

  return badges;
}

function sumPriorities(listParser: (list: string[]) => string[]) {
  return function (list: string[]): number {
    return listParser(list).reduce((sum, item) => sum + Priority[item], 0);
  };
}

export const sumDoubledItemsPriorities = sumPriorities(getDoubledItemsList);
export const sumBadgesPriorities = sumPriorities(getBadgesList);
