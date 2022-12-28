type ResourceType = 'ore' | 'clay' | 'obsidian' | 'geode';
type RobotType = 'ore' | 'clay' | 'obsidian' | 'geode';

type RobotCost = Record<ResourceType, number>;
type Resources = Record<ResourceType, number>;

type Blueprint = {
  id: number;
  robots: Record<RobotType, RobotCost>;
};

type Robots = Record<RobotType, number>;

function parseInput(list: string[]): Blueprint[] {
  const blueprints: Blueprint[] = list.map((blueprintStr, index) => {
    const blueprint = {
      id: index + 1,
      robots: {},
    } as Blueprint;
    const robotsStr = blueprintStr.split(':')[1];
    robotsStr
      .split('.')
      .filter((v) => v)
      .forEach((robotStr) => {
        const [left, right] = robotStr.split('costs');
        const name = left.trim().split(' ')[1] as RobotType;
        const cost = right
          .trim()
          .split('and')
          .map((str) => str.trim().split(' '))
          .reduce(
            (acc, cost) => ({ ...acc, [cost[1]]: Number(cost[0]) }),
            {} as RobotCost
          );

        blueprint.robots[name] = cost;
      });

    return blueprint;
  });
  return blueprints;
}

function updateResources(
  resources: Resources,
  robots: Robots,
  minutes = 1
): Resources {
  const updated = { ...resources };
  Object.entries(robots).forEach(([type, amount]) => {
    updated[type as RobotType] += minutes * amount;
  });

  return updated;
}

function subtractResources(
  resources1: Resources,
  resources2: Resources
): Resources {
  return (Object.keys(resources1) as Array<keyof Resources>).reduce(
    (result, resource) => {
      result[resource] = resources1[resource] - resources2[resource];
      return result;
    },
    {} as Resources
  );
}

function calculateTime(resources: Resources, robots: Robots): number {
  let neededTime = 0;

  (Object.keys(resources) as Array<keyof Resources>).forEach((resource) => {
    const resourceTime = Math.ceil(resources[resource] / robots[resource]);
    if (resourceTime > neededTime) {
      neededTime = resourceTime;
    }
  });

  return neededTime;
}

function getAvailableRobots(
  resources: Resources,
  currentRobots: Robots,
  blueprint: Blueprint
): Partial<Record<RobotType, number>> {
  const availableRobots: Partial<Record<RobotType, number>> = {};

  const possibleRobotTypes: RobotType[] = [];

  (Object.keys(blueprint.robots) as Array<keyof Blueprint['robots']>).forEach(
    (robotType) => {
      const cost = blueprint.robots[robotType];
      const canBeBought = (Object.keys(cost) as Array<keyof RobotCost>).every(
        (resourceType) => currentRobots[resourceType] > 0
      );
      if (canBeBought) {
        possibleRobotTypes.push(robotType);
      }
    }
  );

  possibleRobotTypes.forEach((robotType) => {
    const cost = blueprint.robots[robotType];
    const remainingResources = subtractResources(cost, resources);
    availableRobots[robotType] = calculateTime(
      remainingResources,
      currentRobots
    );
  });

  return availableRobots;
}

function payForRobot(
  type: RobotType,
  blueprint: Blueprint,
  resources: Resources
): Resources {
  const updatedResources = { ...resources };
  (Object.keys(blueprint.robots[type]) as Array<keyof RobotCost>).forEach(
    (resource) => {
      const amount = blueprint.robots[type][resource];
      updatedResources[resource] -= amount;
    }
  );

  return updatedResources;
}

function addRobot(type: RobotType, robots: Robots): Robots {
  const updatedRobots = {
    ...robots,
    [type]: robots[type] + 1,
  };

  return updatedRobots;
}

function canBeatMaxValue(
  maxGeodes: { value: number },
  resources: Resources,
  robots: Robots,
  timeRemaining: number
): Boolean {
  const buildEveryMinute = (timeRemaining: number): number => {
    if (timeRemaining <= 1) return 0;
    return timeRemaining - 1 + buildEveryMinute(timeRemaining - 1);
  };

  return (
    maxGeodes.value <
    resources.geode +
      timeRemaining * robots.geode +
      buildEveryMinute(timeRemaining)
  );
}

function dfs(
  blueprint: Blueprint,
  limits: Partial<Record<RobotType, number>>,
  maxGeodes: { value: number },
  robots: Robots,
  resources: Resources,
  timeRemaining: number
): void {
  if (maxGeodes.value < resources.geode) {
    maxGeodes.value = resources.geode;
  }

  if (timeRemaining <= 0) {
    return;
  }

  if (!canBeatMaxValue(maxGeodes, resources, robots, timeRemaining)) {
    return;
  }

  const availableRobots = getAvailableRobots(resources, robots, blueprint);
  (Object.keys(availableRobots) as Array<keyof typeof availableRobots>)
    .filter((robotType) =>
      limits[robotType]
        ? robots[robotType] < (limits[robotType] as number)
        : true
    )
    .forEach((robotType) => {
      const neededTime = availableRobots[robotType] as number;

      if (neededTime < timeRemaining) {
        const totalTime = neededTime + 1;
        dfs(
          blueprint,
          limits,
          maxGeodes,
          addRobot(robotType, robots),
          payForRobot(
            robotType,
            blueprint,
            updateResources(resources, robots, totalTime)
          ),
          timeRemaining - totalTime
        );
      } else {
        dfs(
          blueprint,
          limits,
          maxGeodes,
          robots,
          updateResources(resources, robots, timeRemaining),
          0
        );
      }
    });

  return;
}

function calculateLimits(
  blueprint: Blueprint
): Partial<Record<RobotType, number>> {
  const limits = {
    ore: 0,
    clay: 0,
    obsidian: 0,
  };

  (Object.keys(blueprint.robots) as RobotType[]).forEach((robotType) => {
    const cost = blueprint.robots[robotType];
    (Object.keys(limits) as Array<keyof typeof limits>).forEach(
      (resourceType) => {
        const amount = cost[resourceType];
        if (amount) {
          limits[resourceType] = Math.max(limits[resourceType], amount);
        }
      }
    );
  });

  return limits;
}

const initialRobots = {
  ore: 1,
  clay: 0,
  obsidian: 0,
  geode: 0,
};

const initialResources = {
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
};

export function solution(list: string[]): number {
  const blueprints = parseInput(list);
  let total = 0;

  blueprints.forEach((blueprint) => {
    const maxGeodes = { value: 0 };

    dfs(
      blueprint,
      calculateLimits(blueprint),
      maxGeodes,
      initialRobots,
      initialResources,
      24
    );

    total += maxGeodes.value * blueprint.id;
  });

  return total;
}

export function solution2(list: string[]): number {
  const blueprints = parseInput(list);
  const values: number[] = [];

  blueprints.slice(0, 3).forEach((blueprint) => {
    const maxGeodes = { value: 0 };

    dfs(
      blueprint,
      calculateLimits(blueprint),
      maxGeodes,
      initialRobots,
      initialResources,
      32
    );

    values.push(maxGeodes.value);
  });

  return values.reduce((acc, num) => acc * num, 1);
}
