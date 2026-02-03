import * as THREE from 'three';

const GAME_STATE = {
  LOADING: 'LOADING',
  MAIN_MENU: 'MAIN_MENU',
  PLANNING: 'PLANNING',
  COMBAT: 'COMBAT',
  ROUND_RESULT: 'ROUND_RESULT',
  AUGMENT_SELECT: 'AUGMENT_SELECT',
  DRAFT: 'DRAFT',
  PAUSED: 'PAUSED'
};

const COMPONENTS = [
  { id: 'scope', name: 'Scope', stat: { range: 1 } },
  { id: 'plating', name: 'Plating', stat: { armor: 12 } },
  { id: 'battery', name: 'Battery', stat: { maxHP: 120 } },
  { id: 'stim', name: 'Stim', stat: { attackSpeed: 0.15 } },
  { id: 'gyro', name: 'Gyro', stat: { crit: 0.12 } },
  { id: 'toolkit', name: 'Toolkit', stat: { lifesteal: 0.12 } }
];

const COMBINED_ITEMS = [
  { id: 'smart-optics', name: 'Smart Optics', parts: ['scope', 'gyro'], stat: { range: 2, crit: 0.1 } },
  { id: 'reactive-armor', name: 'Reactive Armor', parts: ['plating', 'battery'], stat: { armor: 25, maxHP: 200 } },
  { id: 'overcharge', name: 'Overcharge Core', parts: ['battery', 'stim'], stat: { maxHP: 150, attackSpeed: 0.2 } },
  { id: 'command-rig', name: 'Command Rig', parts: ['scope', 'toolkit'], stat: { range: 1, lifesteal: 0.15 } },
  { id: 'gyro-stabilizer', name: 'Gyro Stabilizer', parts: ['gyro', 'stim'], stat: { crit: 0.2, attackSpeed: 0.1 } },
  { id: 'nanite-kit', name: 'Nanite Repair Kit', parts: ['toolkit', 'plating'], stat: { armor: 10, lifesteal: 0.2 } },
  { id: 'ammo-feed', name: 'Ammo Feed', parts: ['scope', 'stim'], stat: { attackSpeed: 0.25 } },
  { id: 'bulwark', name: 'Bulwark Matrix', parts: ['battery', 'toolkit'], stat: { maxHP: 250 } },
  { id: 'shock-ram', name: 'Shock Ram', parts: ['gyro', 'plating'], stat: { armor: 15, attackDamage: 12 } },
  { id: 'targeter', name: 'Targeting AI', parts: ['scope', 'battery'], stat: { range: 1, maxHP: 80 } }
];

const DOCTRINES = [
  {
    id: 'infantry',
    name: 'Infantry',
    tiers: [2, 4, 6],
    bonuses: [
      { maxHP: 120 },
      { maxHP: 220, damageReduction: 0.08 },
      { maxHP: 380, damageReduction: 0.15 }
    ]
  },
  {
    id: 'armor',
    name: 'Armor',
    tiers: [2, 4],
    bonuses: [
      { armor: 18, chargeDamage: 8 },
      { armor: 30, chargeDamage: 18 }
    ]
  },
  {
    id: 'air',
    name: 'Air Support',
    tiers: [2, 3],
    bonuses: [
      { airStrike: 1 },
      { airStrike: 2 }
    ]
  },
  {
    id: 'recon',
    name: 'Recon',
    tiers: [2, 4],
    bonuses: [
      { crit: 0.1, attackSpeed: 0.1 },
      { crit: 0.2, attackSpeed: 0.2 }
    ]
  },
  {
    id: 'medic',
    name: 'Medic',
    tiers: [2, 3],
    bonuses: [
      { healPulse: 0.04 },
      { healPulse: 0.08 }
    ]
  },
  {
    id: 'artillery',
    name: 'Artillery',
    tiers: [2, 3],
    bonuses: [
      { range: 1, splash: 0.25 },
      { range: 2, splash: 0.4 }
    ]
  }
];

const UNIT_DATA = [
  { id: 'rifle-squad', name: 'Rifle Squad', cost: 1, maxHP: 520, attackDamage: 42, attackSpeed: 0.8, range: 1.2, moveSpeed: 2.1, armor: 8, traits: ['infantry'] },
  { id: 'combat-medic', name: 'Combat Medic', cost: 1, maxHP: 480, attackDamage: 30, attackSpeed: 0.9, range: 1.1, moveSpeed: 2.3, armor: 6, traits: ['medic', 'infantry'] },
  { id: 'scout-bike', name: 'Scout Bike', cost: 1, maxHP: 420, attackDamage: 36, attackSpeed: 1.0, range: 1.3, moveSpeed: 2.8, armor: 5, traits: ['recon'] },
  { id: 'drone-swarm', name: 'Drone Swarm', cost: 1, maxHP: 380, attackDamage: 30, attackSpeed: 1.1, range: 2.1, moveSpeed: 2.4, armor: 4, traits: ['air', 'recon'] },
  { id: 'shield-team', name: 'Shield Team', cost: 2, maxHP: 720, attackDamage: 50, attackSpeed: 0.75, range: 1.1, moveSpeed: 2.0, armor: 12, traits: ['infantry'] },
  { id: 'heavy-gunner', name: 'Heavy Gunner', cost: 2, maxHP: 620, attackDamage: 64, attackSpeed: 0.7, range: 2.2, moveSpeed: 1.9, armor: 9, traits: ['infantry', 'artillery'] },
  { id: 'field-doctor', name: 'Field Doctor', cost: 2, maxHP: 540, attackDamage: 32, attackSpeed: 0.9, range: 1.4, moveSpeed: 2.1, armor: 7, traits: ['medic'] },
  { id: 'light-tank', name: 'Light Tank', cost: 2, maxHP: 860, attackDamage: 72, attackSpeed: 0.6, range: 1.5, moveSpeed: 1.7, armor: 16, traits: ['armor'] },
  { id: 'recon-drone', name: 'Recon Drone', cost: 2, maxHP: 460, attackDamage: 38, attackSpeed: 1.0, range: 2.4, moveSpeed: 2.6, armor: 5, traits: ['recon', 'air'] },
  { id: 'assault-transport', name: 'Assault Transport', cost: 3, maxHP: 980, attackDamage: 70, attackSpeed: 0.7, range: 1.3, moveSpeed: 1.8, armor: 18, traits: ['armor', 'infantry'] },
  { id: 'mortar-team', name: 'Mortar Team', cost: 3, maxHP: 560, attackDamage: 84, attackSpeed: 0.65, range: 3.0, moveSpeed: 1.6, armor: 8, traits: ['artillery'] },
  { id: 'stealth-infiltrator', name: 'Stealth Infiltrator', cost: 3, maxHP: 600, attackDamage: 68, attackSpeed: 0.85, range: 1.2, moveSpeed: 2.5, armor: 7, traits: ['recon', 'infantry'] },
  { id: 'air-support-jet', name: 'Air Support Jet', cost: 3, maxHP: 640, attackDamage: 74, attackSpeed: 0.8, range: 3.2, moveSpeed: 2.8, armor: 9, traits: ['air', 'artillery'] },
  { id: 'heavy-tank', name: 'Heavy Tank', cost: 4, maxHP: 1300, attackDamage: 110, attackSpeed: 0.55, range: 1.5, moveSpeed: 1.5, armor: 24, traits: ['armor'] },
  { id: 'rocket-battery', name: 'Rocket Battery', cost: 4, maxHP: 720, attackDamage: 130, attackSpeed: 0.55, range: 3.6, moveSpeed: 1.3, armor: 10, traits: ['artillery'] },
  { id: 'drone-carrier', name: 'Drone Carrier', cost: 4, maxHP: 980, attackDamage: 84, attackSpeed: 0.75, range: 2.8, moveSpeed: 1.6, armor: 14, traits: ['air', 'medic'] },
  { id: 'command-commander', name: 'Command Commander', cost: 5, maxHP: 1200, attackDamage: 120, attackSpeed: 0.8, range: 2.0, moveSpeed: 2.0, armor: 18, traits: ['infantry', 'recon', 'medic'] },
  { id: 'siege-walker', name: 'Siege Walker', cost: 5, maxHP: 1600, attackDamage: 150, attackSpeed: 0.55, range: 2.4, moveSpeed: 1.2, armor: 28, traits: ['armor', 'artillery'] },
  { id: 'sky-warden', name: 'Sky Warden', cost: 5, maxHP: 980, attackDamage: 110, attackSpeed: 0.9, range: 3.4, moveSpeed: 2.6, armor: 14, traits: ['air', 'recon'] }
];

const AUGMENTS = [
  { id: 'supply-drop', name: 'Supply Drop', tier: 1, description: 'Gain 12 gold now.', apply: (game) => game.economy.addGold(12) },
  { id: 'forward-base', name: 'Forward Base', tier: 1, description: '+1 max unit cap.', apply: (game) => game.economy.modifyCap(1) },
  { id: 'rapid-drills', name: 'Rapid Drills', tier: 1, description: 'Units gain +8% attack speed.', apply: (game) => game.traits.addGlobalModifier({ attackSpeed: 0.08 }) },
  { id: 'armor-doctrine', name: 'Armor Doctrine', tier: 2, description: 'Armor units gain +20% HP.', apply: (game) => game.traits.addTraitModifier('armor', { maxHPMult: 0.2 }) },
  { id: 'med-evac', name: 'Med-Evac', tier: 2, description: 'All units heal 4% HP every 5s.', apply: (game) => game.traits.addGlobalModifier({ healPulse: 0.04 }) },
  { id: 'arsenal-cache', name: 'Arsenal Cache', tier: 2, description: 'Gain 2 random components.', apply: (game) => game.items.addRandomComponents(2) },
  { id: 'rapid-deployment', name: 'Rapid Deployment', tier: 3, description: 'First 6s of combat: +25% move & attack speed.', apply: (game) => game.traits.addGlobalModifier({ burstSpeed: 0.25 }) },
  { id: 'overwatch', name: 'Overwatch', tier: 3, description: 'Units gain +15% range and +10% damage.', apply: (game) => game.traits.addGlobalModifier({ range: 0.5, attackDamageMult: 0.1 }) },
  { id: 'tactician', name: 'Tactician', tier: 3, description: 'Gain +2 max unit cap.', apply: (game) => game.economy.modifyCap(2) },
  { id: 'aerial-command', name: 'Aerial Command', tier: 2, description: 'Air units gain +20% crit chance.', apply: (game) => game.traits.addTraitModifier('air', { crit: 0.2 }) },
  { id: 'infantry-drill', name: 'Infantry Drill', tier: 1, description: 'Infantry gain +150 HP.', apply: (game) => game.traits.addTraitModifier('infantry', { maxHP: 150 }) },
  { id: 'precision-ops', name: 'Precision Ops', tier: 2, description: 'Recon units gain +15% crit damage.', apply: (game) => game.traits.addTraitModifier('recon', { critDamage: 0.15 }) }
];

const SHOP_ODDS = {
  1: [1, 0, 0, 0, 0],
  2: [0.7, 0.25, 0.05, 0, 0],
  3: [0.55, 0.3, 0.12, 0.03, 0],
  4: [0.4, 0.33, 0.2, 0.07, 0],
  5: [0.3, 0.33, 0.22, 0.12, 0.03],
  6: [0.2, 0.32, 0.25, 0.18, 0.05],
  7: [0.15, 0.25, 0.3, 0.22, 0.08],
  8: [0.1, 0.2, 0.3, 0.27, 0.13]
};

const UNIT_COLORS = {
  infantry: 0x3b7ea1,
  armor: 0x6b8b3e,
  air: 0x7a5da6,
  recon: 0xa67c3b,
  medic: 0x3da58a,
  artillery: 0x9c3b3b
};

const tmpVec3 = new THREE.Vector3();
const tmpVec3b = new THREE.Vector3();
const tmpVec2 = new THREE.Vector2();

const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

class HexGrid {
  constructor(scene, cols, rows, size) {
    this.scene = scene;
    this.cols = cols;
    this.rows = rows;
    this.size = size;
    this.hexes = [];
    this.meshes = [];
    this.group = new THREE.Group();
    this.highlightMesh = this.createHexMesh(0x60c2ff, 0.18, true);
    this.highlightMesh.visible = false;
    this.group.add(this.highlightMesh);
    this.build();
    this.scene.add(this.group);
  }

  build() {
    const tileMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d2a3f,
      emissive: 0x0e2f45,
      transparent: true,
      opacity: 0.65
    });
    for (let r = 0; r < this.rows; r += 1) {
      for (let q = 0; q < this.cols; q += 1) {
        const world = this.axialToWorld(q, r, tmpVec3);
        const mesh = this.createHexMesh(0x0d2a3f, 0.12, false);
        mesh.position.copy(world);
        mesh.material = tileMaterial;
        mesh.userData.hex = { q, r };
        this.group.add(mesh);
        this.hexes.push({ q, r, world: world.clone() });
        this.meshes.push(mesh);
      }
    }
  }

  createHexMesh(color, height, wireframe) {
    const geometry = new THREE.CylinderGeometry(this.size * 0.95, this.size * 0.95, height, 6);
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: wireframe ? 0.8 : 0.25,
      transparent: true,
      opacity: wireframe ? 0.45 : 0.6,
      wireframe
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = Math.PI / 6;
    return mesh;
  }

  axialToWorld(q, r, target) {
    const x = this.size * Math.sqrt(3) * (q + r / 2);
    const z = this.size * 1.5 * r;
    target.set(x, 0, z);
    target.add(this.getBoardOffset(tmpVec3b));
    return target;
  }

  worldToAxial(position, target) {
    const local = tmpVec3b.copy(position).sub(this.getBoardOffset(tmpVec3));
    const q = (Math.sqrt(3) / 3 * local.x - 1 / 3 * local.z) / this.size;
    const r = (2 / 3 * local.z) / this.size;
    const rounded = this.axialRound(q, r);
    target.set(rounded.q, rounded.r, 0);
    return target;
  }

  axialRound(q, r) {
    let x = q;
    let z = r;
    let y = -x - z;

    let rx = Math.round(x);
    let ry = Math.round(y);
    let rz = Math.round(z);

    const xDiff = Math.abs(rx - x);
    const yDiff = Math.abs(ry - y);
    const zDiff = Math.abs(rz - z);

    if (xDiff > yDiff && xDiff > zDiff) {
      rx = -ry - rz;
    } else if (yDiff > zDiff) {
      ry = -rx - rz;
    } else {
      rz = -rx - ry;
    }

    return { q: rx, r: rz };
  }

  getBoardOffset(target) {
    const width = this.size * Math.sqrt(3) * (this.cols - 1) + this.size * Math.sqrt(3) / 2;
    const height = this.size * 1.5 * (this.rows - 1);
    target.set(-width / 2, 0, -height / 2);
    return target;
  }

  getHex(q, r) {
    return this.hexes.find((hex) => hex.q === q && hex.r === r);
  }

  getNearestHex(position) {
    const axial = this.worldToAxial(position, tmpVec3);
    const q = axial.x;
    const r = axial.y;
    if (q < 0 || r < 0 || q >= this.cols || r >= this.rows) {
      return null;
    }
    return this.getHex(q, r);
  }

  setHighlight(hex) {
    if (!hex) {
      this.highlightMesh.visible = false;
      return;
    }
    this.highlightMesh.visible = true;
    this.highlightMesh.position.copy(hex.world);
  }
}

class Unit {
  constructor(data, isEnemy, starLevel = 1) {
    this.data = data;
    this.isEnemy = isEnemy;
    this.starLevel = starLevel;
    this.items = [];
    this.components = [];
    this.mesh = this.createMesh();
    this.position = this.mesh.position;
    this.target = null;
    this.attackCooldown = 0;
    this.currentHP = 0;
    this.bonus = {
      maxHP: 0,
      maxHPMult: 0,
      attackDamage: 0,
      attackDamageMult: 0,
      attackSpeed: 0,
      range: 0,
      armor: 0,
      crit: 0,
      critDamage: 0,
      moveSpeed: 0,
      damageReduction: 0,
      lifesteal: 0,
      healPulse: 0,
      splash: 0,
      burstSpeed: 0,
      chargeDamage: 0
    };
    this.resetStats();
  }

  createMesh() {
    const trait = this.data.traits[0];
    const color = UNIT_COLORS[trait] || 0x5b7c99;
    let geometry;
    if (this.data.traits.includes('armor')) {
      geometry = new THREE.BoxGeometry(1.1, 0.6, 1.5);
    } else if (this.data.traits.includes('air')) {
      geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 12);
    } else if (this.data.traits.includes('artillery')) {
      geometry = new THREE.CylinderGeometry(0.5, 0.8, 1.0, 8);
    } else {
      geometry = new THREE.CapsuleGeometry(0.45, 0.6, 4, 8);
    }
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.3
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.userData.unit = this;
    return mesh;
  }

  resetStats() {
    const starMult = this.starLevel === 1 ? 1 : this.starLevel === 2 ? 1.8 : 2.6;
    this.maxHP = this.data.maxHP * starMult;
    this.attackDamage = this.data.attackDamage * starMult;
    this.attackSpeed = this.data.attackSpeed;
    this.range = this.data.range;
    this.moveSpeed = this.data.moveSpeed;
    this.armor = this.data.armor || 0;
    this.crit = 0;
    this.critDamage = 0.5;
    this.damageReduction = 0;
    this.lifesteal = 0;
    this.healPulse = 0;
    this.splash = 0;
    this.burstSpeed = 0;
    this.chargeDamage = 0;
    this.applyBonuses();
    this.currentHP = this.maxHP;
    this.attackCooldown = 0;
  }

  applyBonuses() {
    const combined = this.aggregateItemStats();
    this.maxHP += this.bonus.maxHP + combined.maxHP;
    this.maxHP *= 1 + this.bonus.maxHPMult;
    this.attackDamage += this.bonus.attackDamage + combined.attackDamage;
    this.attackDamage *= 1 + this.bonus.attackDamageMult;
    this.attackSpeed += this.bonus.attackSpeed + combined.attackSpeed;
    this.range += this.bonus.range + combined.range;
    this.armor += this.bonus.armor + combined.armor;
    this.crit += this.bonus.crit + combined.crit;
    this.critDamage += this.bonus.critDamage + combined.critDamage;
    this.moveSpeed += this.bonus.moveSpeed + combined.moveSpeed;
    this.damageReduction += this.bonus.damageReduction + combined.damageReduction;
    this.lifesteal += this.bonus.lifesteal + combined.lifesteal;
    this.healPulse += this.bonus.healPulse + combined.healPulse;
    this.splash += this.bonus.splash + combined.splash;
    this.burstSpeed += this.bonus.burstSpeed + combined.burstSpeed;
    this.chargeDamage += this.bonus.chargeDamage + combined.chargeDamage;
  }

  aggregateItemStats() {
    const stats = {
      maxHP: 0,
      attackDamage: 0,
      attackSpeed: 0,
      range: 0,
      armor: 0,
      crit: 0,
      critDamage: 0,
      moveSpeed: 0,
      damageReduction: 0,
      lifesteal: 0,
      healPulse: 0,
      splash: 0,
      burstSpeed: 0,
      chargeDamage: 0
    };
    const all = [...this.items, ...this.components];
    for (const item of all) {
      if (!item.stat) continue;
      for (const [key, value] of Object.entries(item.stat)) {
        stats[key] += value;
      }
    }
    return stats;
  }

  setBonus(key, value) {
    if (this.bonus[key] !== undefined) {
      this.bonus[key] += value;
    }
  }

  resetBonuses() {
    for (const key of Object.keys(this.bonus)) {
      this.bonus[key] = 0;
    }
  }

  takeDamage(amount) {
    const reduced = amount * (1 - this.damageReduction);
    const mitigated = Math.max(0, reduced - this.armor * 0.2);
    this.currentHP -= mitigated;
  }

  isAlive() {
    return this.currentHP > 0;
  }
}

class EconomySystem {
  constructor(game) {
    this.game = game;
    this.gold = 0;
    this.level = 1;
    this.xp = 0;
    this.streak = 0;
    this.maxUnits = 1;
  }

  addGold(amount) {
    this.gold = Math.max(0, this.gold + amount);
  }

  spendGold(amount) {
    if (this.gold < amount) return false;
    this.gold -= amount;
    return true;
  }

  addXP(amount) {
    this.xp += amount;
    const required = this.getXPRequirement();
    while (this.xp >= required && this.level < 8) {
      this.xp -= required;
      this.level += 1;
      this.maxUnits = Math.min(9, this.maxUnits + 1);
    }
  }

  getXPRequirement() {
    return 4 + this.level * 2;
  }

  modifyCap(amount) {
    this.maxUnits += amount;
  }

  roundIncome(win) {
    const base = 5;
    const interest = Math.min(5, Math.floor(this.gold / 10));
    const streakBonus = Math.min(3, Math.floor(Math.abs(this.streak) / 2));
    this.addGold(base + interest + streakBonus + (win ? 1 : 0));
  }

  updateStreak(win) {
    if (win) {
      this.streak = this.streak >= 0 ? this.streak + 1 : 1;
    } else {
      this.streak = this.streak <= 0 ? this.streak - 1 : -1;
    }
  }
}

class ShopSystem {
  constructor(game) {
    this.game = game;
    this.slots = [];
    this.locked = false;
    this.refresh();
  }

  refresh() {
    if (this.locked) return;
    this.slots = Array.from({ length: 5 }, () => this.rollUnit());
  }

  rollUnit() {
    const level = this.game.economy.level;
    const odds = SHOP_ODDS[level] || SHOP_ODDS[8];
    const roll = Math.random();
    let cumulative = 0;
    let tier = 1;
    for (let i = 0; i < odds.length; i += 1) {
      cumulative += odds[i];
      if (roll <= cumulative) {
        tier = i + 1;
        break;
      }
    }
    const pool = UNIT_DATA.filter((unit) => unit.cost === tier);
    return randChoice(pool);
  }

  buyUnit(index) {
    const unitData = this.slots[index];
    if (!unitData) return false;
    if (!this.game.economy.spendGold(unitData.cost)) return false;
    this.game.addUnitToBench(unitData);
    this.slots[index] = this.rollUnit();
    return true;
  }

  toggleLock() {
    this.locked = !this.locked;
  }
}

class TraitSystem {
  constructor(game) {
    this.game = game;
    this.active = {};
    this.globalModifiers = [];
    this.traitModifiers = {};
  }

  addGlobalModifier(mod) {
    this.globalModifiers.push(mod);
  }

  addTraitModifier(trait, mod) {
    if (!this.traitModifiers[trait]) {
      this.traitModifiers[trait] = [];
    }
    this.traitModifiers[trait].push(mod);
  }

  computeTraits(units) {
    const counts = {};
    for (const unit of units) {
      for (const trait of unit.data.traits) {
        counts[trait] = (counts[trait] || 0) + 1;
      }
    }

    this.active = {};
    for (const doctrine of DOCTRINES) {
      const count = counts[doctrine.id] || 0;
      let tierIndex = -1;
      for (let i = 0; i < doctrine.tiers.length; i += 1) {
        if (count >= doctrine.tiers[i]) {
          tierIndex = i;
        }
      }
      if (tierIndex >= 0) {
        this.active[doctrine.id] = {
          count,
          tier: doctrine.tiers[tierIndex],
          bonus: doctrine.bonuses[tierIndex]
        };
      }
    }
  }

  applyTraits(units) {
    for (const unit of units) {
      unit.resetBonuses();
    }
    for (const unit of units) {
      for (const global of this.globalModifiers) {
        this.applyModifier(unit, global);
      }
      for (const trait of unit.data.traits) {
        const active = this.active[trait];
        if (active) {
          this.applyModifier(unit, active.bonus);
        }
        const extra = this.traitModifiers[trait] || [];
        for (const mod of extra) {
          this.applyModifier(unit, mod);
        }
      }
      unit.resetStats();
    }
  }

  applyModifier(unit, mod) {
    for (const [key, value] of Object.entries(mod)) {
      if (key === 'maxHPMult' || key === 'attackDamageMult') {
        unit.bonus[key] += value;
      } else {
        unit.setBonus(key, value);
      }
    }
  }
}

class CombatSystem {
  constructor(game) {
    this.game = game;
    this.timer = 0;
    this.duration = 30;
  }

  start() {
    this.timer = 0;
    for (const unit of this.game.units) {
      unit.target = null;
      unit.attackCooldown = 0;
    }
  }

  update(delta) {
    this.timer += delta;
    this.applyMedicPulse(delta);
    for (const unit of this.game.units) {
      if (!unit.isAlive()) continue;
      const target = this.getTarget(unit);
      if (!target) continue;
      const distance = unit.position.distanceTo(target.position);
      if (distance <= unit.range + 0.2) {
        this.handleAttack(unit, target, delta);
      } else {
        this.moveTowards(unit, target, delta);
      }
    }
    this.game.cleanupDead();
    if (this.game.isCombatOver() || this.timer >= this.duration) {
      this.game.endCombat();
    }
  }

  applyMedicPulse(delta) {
    for (const unit of this.game.units) {
      if (!unit.isAlive()) continue;
      if (unit.healPulse > 0) {
        unit.currentHP = Math.min(unit.maxHP, unit.currentHP + unit.maxHP * unit.healPulse * delta * 0.2);
      }
    }
  }

  getTarget(unit) {
    if (unit.target && unit.target.isAlive()) return unit.target;
    let nearest = null;
    let nearestDist = Infinity;
    for (const other of this.game.units) {
      if (other.isEnemy === unit.isEnemy) continue;
      if (!other.isAlive()) continue;
      const dist = unit.position.distanceTo(other.position);
      if (dist < nearestDist) {
        nearest = other;
        nearestDist = dist;
      }
    }
    unit.target = nearest;
    return nearest;
  }

  moveTowards(unit, target, delta) {
    const speed = unit.moveSpeed * (1 + (this.timer < 6 ? unit.burstSpeed : 0));
    tmpVec3.copy(target.position).sub(unit.position).setY(0);
    if (tmpVec3.lengthSq() < 0.01) return;
    tmpVec3.normalize().multiplyScalar(speed * delta);
    unit.position.add(tmpVec3);
  }

  handleAttack(unit, target, delta) {
    unit.attackCooldown -= delta;
    if (unit.attackCooldown > 0) return;
    unit.attackCooldown = 1 / unit.attackSpeed;
    let damage = unit.attackDamage;
    if (Math.random() < unit.crit) {
      damage *= 1 + unit.critDamage;
    }
    target.takeDamage(damage);
    if (unit.chargeDamage > 0 && unit.position.distanceTo(target.position) < 1.2) {
      target.takeDamage(unit.chargeDamage);
    }
    if (unit.lifesteal > 0) {
      unit.currentHP = Math.min(unit.maxHP, unit.currentHP + damage * unit.lifesteal);
    }
    if (unit.splash > 0) {
      for (const other of this.game.units) {
        if (other.isEnemy === unit.isEnemy || other === target || !other.isAlive()) continue;
        if (other.position.distanceTo(target.position) < 1.2) {
          other.takeDamage(damage * unit.splash);
        }
      }
    }
  }
}

class UISystem {
  constructor(game) {
    this.game = game;
    this.elements = {
      round: document.getElementById('round'),
      hp: document.getElementById('hp'),
      gold: document.getElementById('gold'),
      level: document.getElementById('level'),
      timer: document.getElementById('timer'),
      shop: document.getElementById('shop'),
      reroll: document.getElementById('reroll'),
      buyXp: document.getElementById('buy-xp'),
      lock: document.getElementById('lock'),
      bench: document.getElementById('bench'),
      items: document.getElementById('items'),
      doctrines: document.getElementById('doctrine-list'),
      overlay: document.getElementById('overlay'),
      augment: document.getElementById('augment'),
      draft: document.getElementById('draft'),
      tooltip: document.getElementById('tooltip'),
      pause: document.getElementById('pause'),
      startCombat: document.getElementById('start-combat')
    };
    this.attachEvents();
  }

  attachEvents() {
    document.getElementById('start-game').addEventListener('click', () => this.game.start());
    this.elements.reroll.addEventListener('click', () => {
      if (this.game.state !== GAME_STATE.PLANNING) return;
      if (this.game.economy.spendGold(2)) {
        this.game.shop.refresh();
        this.updateShop();
        this.updateHeader();
      }
    });
    this.elements.buyXp.addEventListener('click', () => {
      if (this.game.state !== GAME_STATE.PLANNING) return;
      if (this.game.economy.spendGold(4)) {
        this.game.economy.addXP(4);
        this.updateHeader();
        this.updateShop();
      }
    });
    this.elements.lock.addEventListener('click', () => {
      this.game.shop.toggleLock();
      this.elements.lock.textContent = this.game.shop.locked ? 'Unlock Shop' : 'Lock Shop';
    });
    this.elements.startCombat.addEventListener('click', () => {
      if (this.game.state === GAME_STATE.PLANNING) {
        this.game.transitionToCombat();
      }
    });
  }

  updateHeader() {
    this.elements.round.textContent = `Round ${this.game.round}`;
    this.elements.hp.textContent = `HP ${this.game.playerHP}`;
    this.elements.gold.textContent = `Gold ${this.game.economy.gold}`;
    this.elements.level.textContent = `Level ${this.game.economy.level}`;
  }

  updateTimer(value) {
    this.elements.timer.textContent = value.toString().padStart(2, '0');
  }

  updateShop() {
    this.elements.shop.innerHTML = '';
    this.game.shop.slots.forEach((unit, index) => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <strong>${unit.name}</strong>
        <div>Cost: ${unit.cost}</div>
        <div>${unit.traits.join(' / ')}</div>
      `;
      const button = document.createElement('button');
      button.textContent = 'Buy';
      button.disabled = this.game.economy.gold < unit.cost || this.game.benchFull();
      button.addEventListener('click', () => {
        if (this.game.shop.buyUnit(index)) {
          this.updateShop();
          this.updateBench();
          this.updateHeader();
          this.updateDoctrines();
        }
      });
      card.appendChild(button);
      card.addEventListener('mouseenter', (event) => this.showTooltip(event, unit));
      card.addEventListener('mouseleave', () => this.hideTooltip());
      this.elements.shop.appendChild(card);
    });
  }

  updateBench() {
    this.elements.bench.innerHTML = '';
    this.game.bench.forEach((unit, index) => {
      const slot = document.createElement('div');
      slot.className = 'slot';
      if (unit) {
        slot.textContent = `${unit.data.name} ★${unit.starLevel}`;
        slot.addEventListener('mouseenter', (event) => this.showTooltip(event, unit.data, unit));
        slot.addEventListener('mouseleave', () => this.hideTooltip());
      } else {
        slot.textContent = `Bench ${index + 1}`;
      }
      this.elements.bench.appendChild(slot);
    });
  }

  updateItems() {
    this.elements.items.innerHTML = '';
    this.game.items.inventory.forEach((item, index) => {
      const slot = document.createElement('div');
      slot.className = 'slot';
      if (item) {
        slot.textContent = item.name;
        slot.addEventListener('click', () => this.game.items.selectItem(index));
        slot.addEventListener('mouseenter', (event) => this.showTooltip(event, item));
        slot.addEventListener('mouseleave', () => this.hideTooltip());
        if (this.game.items.selectedIndex === index) {
          slot.style.borderColor = '#60c2ff';
        }
      } else {
        slot.textContent = 'Component';
      }
      this.elements.items.appendChild(slot);
    });
  }

  updateDoctrines() {
    this.elements.doctrines.innerHTML = '';
    for (const doctrine of DOCTRINES) {
      const active = this.game.traits.active[doctrine.id];
      const div = document.createElement('div');
      if (active) {
        div.textContent = `${doctrine.name} (${active.count}) - Tier ${active.tier}`;
      } else {
        div.textContent = `${doctrine.name} (0)`;
        div.style.opacity = 0.4;
      }
      this.elements.doctrines.appendChild(div);
    }
  }

  showAugmentChoices(choices) {
    const grid = this.elements.augment.querySelector('.augment-grid');
    grid.innerHTML = '';
    for (const augment of choices) {
      const card = document.createElement('div');
      card.className = 'augment-card';
      card.innerHTML = `<strong>${augment.name}</strong><p>${augment.description}</p>`;
      card.addEventListener('click', () => this.game.selectAugment(augment));
      grid.appendChild(card);
    }
    this.elements.augment.classList.add('active');
  }

  hideAugments() {
    this.elements.augment.classList.remove('active');
  }

  showDraft(choices) {
    const grid = this.elements.draft.querySelector('.draft-grid');
    grid.innerHTML = '';
    for (const choice of choices) {
      const card = document.createElement('div');
      card.className = 'draft-card';
      card.innerHTML = `<strong>${choice.unit.name}</strong><p>${choice.item.name}</p>`;
      card.addEventListener('click', () => this.game.selectDraft(choice));
      grid.appendChild(card);
    }
    this.elements.draft.classList.add('active');
  }

  hideDraft() {
    this.elements.draft.classList.remove('active');
  }

  showOverlay(active) {
    this.elements.overlay.classList.toggle('active', active);
  }

  setPaused(paused) {
    this.elements.pause.classList.toggle('active', paused);
  }

  showTooltip(event, data, unit) {
    const tooltip = this.elements.tooltip;
    tooltip.style.display = 'block';
    tooltip.style.left = `${event.clientX + 12}px`;
    tooltip.style.top = `${event.clientY + 12}px`;
    if (data.traits) {
      tooltip.innerHTML = `<strong>${data.name}</strong><div>Cost ${data.cost}</div><div>HP ${Math.round((unit?.maxHP || data.maxHP))}</div><div>Damage ${data.attackDamage}</div><div>AS ${data.attackSpeed}</div><div>Range ${data.range}</div><div>${data.traits.join(' / ')}</div>`;
    } else {
      tooltip.innerHTML = `<strong>${data.name}</strong>`;
    }
  }

  hideTooltip() {
    this.elements.tooltip.style.display = 'none';
  }
}

class ItemSystem {
  constructor(game) {
    this.game = game;
    this.inventory = Array.from({ length: 6 }, () => null);
    this.selectedIndex = null;
  }

  addItem(item) {
    const empty = this.inventory.findIndex((slot) => slot === null);
    if (empty >= 0) {
      this.inventory[empty] = item;
    }
  }

  addRandomComponents(count) {
    for (let i = 0; i < count; i += 1) {
      this.addItem(randChoice(COMPONENTS));
    }
  }

  selectItem(index) {
    if (!this.inventory[index]) {
      this.selectedIndex = null;
      return;
    }
    this.selectedIndex = this.selectedIndex === index ? null : index;
    this.game.ui.updateItems();
  }

  equipSelected(unit) {
    if (this.selectedIndex === null) return false;
    const item = this.inventory[this.selectedIndex];
    if (!item) return false;
    const isComponent = COMPONENTS.some((component) => component.id === item.id);
    if (isComponent) {
      if (unit.items.length + unit.components.length >= 3) return false;
      if (unit.components.length > 0) {
        const combo = this.combineComponents(unit.components[0], item);
        if (combo) {
          unit.components = [];
          unit.items.push(combo);
        } else {
          unit.components.push(item);
        }
      } else {
        unit.components.push(item);
      }
    } else {
      if (unit.items.length + unit.components.length >= 3) return false;
      unit.items.push(item);
    }
    this.inventory[this.selectedIndex] = null;
    this.selectedIndex = null;
    unit.resetStats();
    return true;
  }

  combineComponents(first, second) {
    return COMBINED_ITEMS.find((item) => {
      const parts = item.parts;
      return (parts[0] === first.id && parts[1] === second.id) || (parts[0] === second.id && parts[1] === first.id);
    });
  }
}

class Game {
  constructor() {
    this.state = GAME_STATE.LOADING;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x050b14, 10, 45);
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 14, 16);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.stateTimer = 0;
    this.round = 1;
    this.playerHP = 100;
    this.planningDuration = 30;
    this.planningTimer = this.planningDuration;

    this.grid = new HexGrid(this.scene, 8, 7, 1.4);
    this.units = [];
    this.bench = Array.from({ length: 9 }, () => null);
    this.board = {};
    this.enemyBoard = {};
    this.selectedUnit = null;
    this.dragging = false;

    this.economy = new EconomySystem(this);
    this.shop = new ShopSystem(this);
    this.traits = new TraitSystem(this);
    this.combat = new CombatSystem(this);
    this.items = new ItemSystem(this);
    this.ui = new UISystem(this);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    this.setupLights();
    this.setupBoard();
    this.attachEvents();
    this.ui.showOverlay(true);
    this.ui.updateShop();
    this.ui.updateBench();
    this.ui.updateItems();
    this.ui.updateDoctrines();
    this.ui.updateHeader();

    this.state = GAME_STATE.MAIN_MENU;
    this.animate();
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(0x6fa8dc, 0.6);
    this.scene.add(ambient);
    const key = new THREE.DirectionalLight(0x88d4ff, 0.8);
    key.position.set(10, 20, 10);
    this.scene.add(key);
    const rim = new THREE.PointLight(0x2f89ff, 0.6, 40);
    rim.position.set(-10, 8, -8);
    this.scene.add(rim);
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(16, 16, 0.6, 32),
      new THREE.MeshStandardMaterial({ color: 0x071624, emissive: 0x0b1f30 })
    );
    table.position.y = -0.35;
    this.scene.add(table);
  }

  setupBoard() {
    this.spawnInitialUnits();
  }

  spawnInitialUnits() {
    this.economy.addGold(10);
    this.items.addRandomComponents(2);
  }

  start() {
    this.ui.showOverlay(false);
    this.state = GAME_STATE.PLANNING;
    this.startPlanning();
  }

  startPlanning() {
    this.planningTimer = this.planningDuration;
    this.ui.updateShop();
    this.ui.updateBench();
    this.ui.updateItems();
    this.ui.updateHeader();
    this.updateTraits();
    this.spawnEnemy();
  }

  transitionToCombat() {
    this.state = GAME_STATE.COMBAT;
    this.stateTimer = 0;
    this.updateTraits();
    this.combat.start();
  }

  endCombat() {
    const win = this.playerUnits().length > 0 && this.enemyUnits().length === 0;
    this.state = GAME_STATE.ROUND_RESULT;
    this.resolveRound(win);
  }

  resolveRound(win) {
    if (!win) {
      const damage = Math.max(2, this.enemyUnits().length * 2);
      this.playerHP = Math.max(0, this.playerHP - damage);
    }
    this.economy.updateStreak(win);
    this.economy.roundIncome(win);
    if (win) {
      this.economy.addGold(1);
    }
    this.items.addRandomComponents(1);
    if (this.playerHP <= 0) {
      this.resetGame();
      return;
    }
    this.round += 1;
    this.ui.updateHeader();
    this.ui.updateItems();
    if (this.round === 2 || this.round === 5 || this.round === 8) {
      this.enterAugments();
      return;
    }
    if (this.round % 6 === 0) {
      this.enterDraft();
      return;
    }
    this.state = GAME_STATE.PLANNING;
    this.startPlanning();
  }

  enterAugments() {
    this.state = GAME_STATE.AUGMENT_SELECT;
    const choices = this.getAugmentChoices();
    this.ui.showAugmentChoices(choices);
  }

  selectAugment(augment) {
    augment.apply(this);
    this.ui.hideAugments();
    this.state = GAME_STATE.PLANNING;
    this.startPlanning();
  }

  enterDraft() {
    this.state = GAME_STATE.DRAFT;
    const choices = Array.from({ length: 9 }, () => ({
      unit: randChoice(UNIT_DATA),
      item: randChoice([...COMPONENTS, ...COMBINED_ITEMS])
    }));
    this.ui.showDraft(choices);
  }

  selectDraft(choice) {
    this.ui.hideDraft();
    this.addUnitToBench(choice.unit);
    this.items.addItem(choice.item);
    this.state = GAME_STATE.PLANNING;
    this.startPlanning();
  }

  getAugmentChoices() {
    const tier = this.round <= 2 ? 1 : this.round <= 5 ? 2 : 3;
    const pool = AUGMENTS.filter((aug) => aug.tier === tier);
    return [randChoice(pool), randChoice(pool), randChoice(pool)];
  }

  spawnEnemy() {
    for (const unit of this.enemyUnits()) {
      this.scene.remove(unit.mesh);
    }
    this.enemyBoard = {};
    this.units = this.units.filter((unit) => !unit.isEnemy);
    const enemyCount = Math.min(this.economy.maxUnits, 6);
    for (let i = 0; i < enemyCount; i += 1) {
      const unitData = randChoice(UNIT_DATA);
      const enemy = new Unit(unitData, true, Math.random() < 0.2 ? 2 : 1);
      const pos = this.getEnemySpawn(i);
      enemy.position.copy(pos);
      this.units.push(enemy);
      this.scene.add(enemy.mesh);
      this.enemyBoard[`${enemy.position.x.toFixed(2)}-${enemy.position.z.toFixed(2)}`] = enemy;
    }
  }

  getEnemySpawn(index) {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const hex = this.grid.getHex(col, row);
    return hex ? hex.world : new THREE.Vector3(0, 0, 0);
  }

  addUnitToBench(unitData) {
    const unit = new Unit(unitData, false, 1);
    const index = this.bench.findIndex((slot) => slot === null);
    if (index === -1) return;
    this.bench[index] = unit;
    this.scene.add(unit.mesh);
    unit.position.copy(this.getBenchPosition(index));
    this.combineUnits();
  }

  combineUnits() {
    const all = [...this.bench, ...this.playerUnits()];
    const byId = {};
    for (const unit of all) {
      if (!unit) continue;
      const key = `${unit.data.id}-${unit.starLevel}`;
      if (!byId[key]) byId[key] = [];
      byId[key].push(unit);
    }
    for (const key of Object.keys(byId)) {
      const group = byId[key];
      if (group.length >= 3) {
        const target = group[0];
        target.starLevel = Math.min(3, target.starLevel + 1);
        for (let i = 1; i < 3; i += 1) {
          this.transferItems(group[i], target);
          this.removeUnit(group[i]);
        }
        target.resetStats();
      }
    }
  }

  transferItems(source, target) {
    const items = [...source.items, ...source.components];
    for (const item of items) {
      if (target.items.length + target.components.length >= 3) break;
      const isComponent = COMPONENTS.some((component) => component.id === item.id);
      if (isComponent) {
        if (target.components.length > 0) {
          const combo = this.items.combineComponents(target.components[0], item);
          if (combo) {
            target.components = [];
            target.items.push(combo);
          } else {
            target.components.push(item);
          }
        } else {
          target.components.push(item);
        }
      } else {
        target.items.push(item);
      }
    }
  }

  removeUnit(unit) {
    const benchIndex = this.bench.indexOf(unit);
    if (benchIndex >= 0) {
      this.bench[benchIndex] = null;
    }
    const boardKey = Object.keys(this.board).find((key) => this.board[key] === unit);
    if (boardKey) {
      delete this.board[boardKey];
    }
    this.units = this.units.filter((entry) => entry !== unit);
    this.scene.remove(unit.mesh);
  }

  placeUnitOnHex(unit, hex) {
    const key = `${hex.q}-${hex.r}`;
    if (this.board[key] && this.board[key] !== unit) return false;
    const alreadyOnBoard = Object.values(this.board).includes(unit);
    if (!alreadyOnBoard && this.playerUnits().length >= this.economy.maxUnits) {
      return false;
    }
    const benchIndex = this.bench.indexOf(unit);
    if (benchIndex >= 0) {
      this.bench[benchIndex] = null;
    }
    for (const [existingKey, existingUnit] of Object.entries(this.board)) {
      if (existingUnit === unit) {
        delete this.board[existingKey];
      }
    }
    this.board[key] = unit;
    unit.position.copy(hex.world);
    this.updateTraits();
    return true;
  }

  moveUnitToBench(unit) {
    const benchIndex = this.bench.findIndex((slot) => slot === null);
    if (benchIndex < 0) return;
    for (const [existingKey, existingUnit] of Object.entries(this.board)) {
      if (existingUnit === unit) {
        delete this.board[existingKey];
      }
    }
    this.bench[benchIndex] = unit;
    unit.position.copy(this.getBenchPosition(benchIndex));
    this.updateTraits();
  }

  getBenchPosition(index) {
    const start = this.grid.getBoardOffset(tmpVec3).clone();
    start.x += -6 + index * 1.4;
    start.z += 12.5;
    return start;
  }

  benchFull() {
    return this.bench.every((slot) => slot !== null);
  }

  playerUnits() {
    return this.units.filter((unit) => !unit.isEnemy);
  }

  enemyUnits() {
    return this.units.filter((unit) => unit.isEnemy);
  }

  updateTraits() {
    const active = this.playerUnits();
    this.traits.computeTraits(active);
    this.traits.applyTraits(active);
    this.ui.updateDoctrines();
  }

  isCombatOver() {
    return this.playerUnits().length === 0 || this.enemyUnits().length === 0;
  }

  cleanupDead() {
    for (const unit of [...this.units]) {
      if (!unit.isAlive()) {
        this.removeUnit(unit);
      }
    }
  }

  attachEvents() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('keydown', (event) => this.onKeyDown(event));
    this.renderer.domElement.addEventListener('pointermove', (event) => this.onPointerMove(event));
    this.renderer.domElement.addEventListener('pointerdown', (event) => this.onPointerDown(event));
    this.renderer.domElement.addEventListener('pointerup', (event) => this.onPointerUp(event));
    this.renderer.domElement.addEventListener('wheel', (event) => this.onWheel(event));
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onKeyDown(event) {
    if (event.key === 'Escape') {
      if (this.state === GAME_STATE.PAUSED) {
        this.state = GAME_STATE.PLANNING;
        this.ui.setPaused(false);
      } else if (this.state === GAME_STATE.PLANNING) {
        this.state = GAME_STATE.PAUSED;
        this.ui.setPaused(true);
      }
    }
    if (event.code === 'Space' && this.state === GAME_STATE.PLANNING) {
      this.transitionToCombat();
    }
  }

  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const intersects = this.raycaster.intersectObjects(this.grid.meshes, false);
    if (intersects.length > 0) {
      const hex = intersects[0].object.userData.hex;
      this.grid.setHighlight(this.grid.getHex(hex.q, hex.r));
    } else {
      this.grid.setHighlight(null);
    }

    if (this.dragging && this.selectedUnit) {
      this.raycaster.ray.intersectPlane(this.dragPlane, tmpVec3);
      if (tmpVec3) {
        this.selectedUnit.position.copy(tmpVec3);
      }
    }
  }

  onPointerDown(event) {
    if (this.state !== GAME_STATE.PLANNING) return;
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.units.map((unit) => unit.mesh), false);
    if (intersects.length > 0) {
      const unit = intersects[0].object.userData.unit;
      if (unit && !unit.isEnemy) {
        this.selectedUnit = unit;
        if (this.items.selectedIndex !== null) {
          if (this.items.equipSelected(unit)) {
            this.ui.updateItems();
            this.ui.updateBench();
            this.updateTraits();
          }
        } else {
          this.dragging = true;
        }
      }
    } else {
      this.selectedUnit = null;
    }
  }

  onPointerUp() {
    if (!this.dragging || !this.selectedUnit) {
      this.dragging = false;
      return;
    }
    const hex = this.grid.getNearestHex(this.selectedUnit.position);
    if (hex && this.isPlayerZone(hex)) {
      if (!this.placeUnitOnHex(this.selectedUnit, hex)) {
        this.moveUnitToBench(this.selectedUnit);
      }
    } else {
      this.moveUnitToBench(this.selectedUnit);
    }
    this.dragging = false;
    this.selectedUnit = null;
    this.ui.updateBench();
    this.ui.updateShop();
    this.ui.updateItems();
  }

  onWheel(event) {
    this.camera.position.y = THREE.MathUtils.clamp(this.camera.position.y + event.deltaY * 0.01, 6, 22);
  }

  isPlayerZone(hex) {
    return hex.r >= 3;
  }

  updateCamera(delta) {
    const speed = 8 * delta;
    if (this.keys?.['KeyW']) this.camera.position.z -= speed;
    if (this.keys?.['KeyS']) this.camera.position.z += speed;
    if (this.keys?.['KeyA']) this.camera.position.x -= speed;
    if (this.keys?.['KeyD']) this.camera.position.x += speed;
    if (this.keys?.['KeyQ']) this.camera.rotation.y += speed * 0.4;
    if (this.keys?.['KeyE']) this.camera.rotation.y -= speed * 0.4;
  }

  resetGame() {
    window.location.reload();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    if (!this.keys) {
      this.keys = {};
      window.addEventListener('keydown', (event) => (this.keys[event.code] = true));
      window.addEventListener('keyup', (event) => (this.keys[event.code] = false));
    }
    if (this.state === GAME_STATE.PLANNING) {
      this.planningTimer -= delta;
      this.ui.updateTimer(Math.ceil(this.planningTimer));
      if (this.planningTimer <= 0) {
        this.transitionToCombat();
      }
    }
    if (this.state === GAME_STATE.COMBAT) {
      this.combat.update(delta);
      this.ui.updateTimer(Math.ceil(this.combat.duration - this.combat.timer));
    }
    if (this.state === GAME_STATE.PLANNING || this.state === GAME_STATE.COMBAT) {
      this.updateCamera(delta);
    }
    this.renderer.render(this.scene, this.camera);
  }
}

new Game();
