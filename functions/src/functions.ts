export async function diceRoll(parameters: { min: number; max: number }) {
  const { min, max } = parameters;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function calculateDamage(parameters: {
  attackerDmg: number;
  defenderArmor: number;
}) {
  // For now, return attakerDmg
  return parameters.attackerDmg;
}

export async function applyDamage(parameters: {
  targetHP: number;
  damage: number;
}) {
  const { targetHP, damage } = parameters;
  return Math.max(0, targetHP - damage);
}

export async function summarizeTurn(parameters: {
  playerActionSummary: string;
  enemyActionSummary: string;
  playerStats: any;
  enemyStats: any;
  gameOver: boolean;
}) {
  const {
    playerActionSummary,
    enemyActionSummary,
    playerStats,
    enemyStats,
    gameOver,
  } = parameters;
  let summary = `**Turn Summary:**\n`;
  summary += `Player Action: ${playerActionSummary}\n`;
  summary += `Enemy Action: ${enemyActionSummary}\n\n`;
  summary += `**Stats:**\n`;
  summary += `Player HP: ${playerStats.hp}, Enemy HP: ${enemyStats.hp}\n`;
  if (gameOver) {
    summary += `\n**Game Over!**\n`;
    if (playerStats.hp <= 0) {
      summary += `You have been defeated!\n`;
    } else {
      summary += `You have vanquished the enemy!\n`;
    }
  }
  return summary;
}
