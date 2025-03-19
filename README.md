# AI Encounter Agent

## Overview
AI Encounter is an AI-powered agent designed to generate and manage dynamic Dungeons & Dragons-style battle encounters. The system uses a **Genkit AI agent** to interpret player actions, determine combat outcomes, and provide detailed narrative elaborations.

### **Key Features**
- **AI-Driven Decision Making**: Determines whether a player is executing an action (e.g., attacking) or requesting additional scenario details.
- **Turn-Based Combat Simulation**: AI calculates damage, updates character stats, and determines combat outcomes.
- **Automated Narrative Generation**: Provides battle descriptions and storytelling.
- **Flexible API Integration**: Built with Firebase Genkit, allowing easy integration with various frontend applications.

## **How It Works**

### **Generating a New Encounter**
At the start of the game or when requested, the AI dynamically generates a new battle encounter:
```json
{
  "playerHp": 50,
  "playerDmg": 12,
  "enemyHp": 40,
  "enemyDmg": 10,
  "lastNarrative": "A goblin emerges from the shadows, ready for battle!"
}
```

### **Action Analysis** (Flipping a Boolean for Decision Making)

When the player submits a text input, the AI **analyzes the intent**:
- If the player requests additional details (e.g., "What does the enemy look like?"), the AI sets `elaborate: true`.
- If the player takes an action (e.g., "I attack!"), the AI sets `elaborate: false` and **executes the combat mechanics**.

```json
{
  "elaborate": false,
  "summary": "The player swings their sword at the goblin with full force."
}
```

### **Elaborating the Scenario**
If the AI thinks you're asking for elaboration it will generate additional scene details without affecting combat mechanics.

```json
{
  "elaborate": false,
  "summary": "The goblin snarls, its dagger glinting in the firelight as it circles you warily."
}
```

### **Executing the Turn-Based Combat**
If `elaborate: false`, the AI updates the game state in very simple fashion:
- Adjusts player and enemy HP based on attack rolls.
- Checks if either combatant has won.
- Returns a **new battle narrative** based on the combat exchange by feeding the narrative up to that point to the AI.

#### Example Turn Calculation
```json
{
  "turn": 2,
  "playerCurrentHp": 35,
  "enemyCurrentHp": 10,
  "playerWon": false,
  "enemyWon": false,
  "lastNarrative": "You land a solid hit, but the goblin retaliates with a swift cut to your arm."
}
```


### **Summarizing the Battle Turn**
After each round, the AI generates a brief summary of what happened in the turn and appends it to the full narrative:
```json
{
  "summary": "The goblin lunges, but you dodge and strike back, wounding its shoulder."
}
```

## **Natural next steps**
- Expand battle mechanics from simple dice rolls.
- Generate a random inventory of items for the player.
- Generate a more nuanced character using a DnD character sheet as inspiration.
- Introduce skill-based actions.

