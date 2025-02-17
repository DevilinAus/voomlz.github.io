import {
  gearHasTempEnchant,
  gearSetCount,
  getThreatCoefficient,
  handler_modDamage,
} from "../era/base.js";

export const config = {
  Mods: {
    MoltenBlast: 2.0,
    EarthShock: 2.0,
    SpiritOfTheAlpha: 1.45,

    /**
     * While Rockbiter Weapon is active on your main hand weapon and you have a shield equipped,
     * you deal 65% increased threat
     */
    WayOfEarth: 1.65,

    LoyalBeta: 0.7,

    /** When Spirit of the Alpha is active, increases threat generated by 20%. */
    TAQ_Tank_4pc: 1.2,
  },
  Buff: {
    TranquilAirTotem: 25909,
    SpiritOfTheAlpha: 408696,
    LoyalBeta: 443320,
    TAQ_Tank_4pc: 1213937,
    ActivateWayOfEarth: 461635, // Utility buff to activate Way of Earth if conditions met
  },
  Spell: {
    EarthShockR1: 8042,
    EarthShockR2: 8044,
    EarthShockR3: 8045,
    EarthShockR4: 8046,
    EarthShockR5: 10412,
    EarthShockR6: 10413,
    EarthShockR7: 10414,
    EarthShockTaunt: 408690,

    MoltenBlast: 425339,
  },
  Tier: {
    TAQ_Tank: 1852,
  },
  Enchant: {
    SouOfTheAlpha: 7683, // TAQ_Tank_4pc
    RockbiterWeapon: 7568,
  },
};

export const initialBuffs = {
  [config.Buff.SpiritOfTheAlpha]: 0,
  [config.Buff.WayOfEarth]: 0,
  [config.Buff.TAQ_Tank_4pc]: 0,
};

export const buffNames = {
  [config.Buff.TranquilAirTotem]: "Tranquil Air Totem",
  [config.Buff.SpiritOfTheAlpha]: "Spirit of the Alpha",
  [config.Buff.LoyalBeta]: "Loyal Beta",
  [config.Buff.WayOfEarth]: "Way of Earth",
  [config.Buff.TAQ_Tank_4pc]: "S03 - Item - TAQ - Shaman - Tank 4P Bonus",
  [config.Buff.ActivateWayOfEarth]: "Way of Earth (w/ Rockbiter + Shield)",
};

export const buffMultipliers = {
  [config.Buff.TranquilAirTotem]: getThreatCoefficient(0.8), // Tranquil Air Totem Aura
  [config.Buff.SpiritOfTheAlpha]: getThreatCoefficient(
    config.Mods.SpiritOfTheAlpha
  ),
  [config.Buff.LoyalBeta]: getThreatCoefficient(config.Mods.LoyalBeta),
  [config.Buff.TAQ_Tank_4pc]: {
    coeff: (buffs, spellId) => {
      if (config.Buff.SpiritOfTheAlpha in buffs) {
        return getThreatCoefficient(config.Mods.TAQ_Tank_4pc);
      }
      return getThreatCoefficient(1);
    },
  },
  [config.Buff.WayOfEarth]: {
    coeff: (buffs, spellId) => {
      if (config.Buff.ActivateWayOfEarth in buffs) {
        return getThreatCoefficient(config.Mods.WayOfEarth);
      }
      return getThreatCoefficient(1);
    },
  },
};

export const HEALING_SPELLS = {
  8004: true,
  8008: true,
  8010: true,
  10466: true,
  10467: true,
  10468: true, // Lesser Healing Wave
  331: true,
  332: true,
  547: true,
  913: true,
  939: true,
  959: true,
  8005: true,
  10395: true,
  10396: true,
  25357: true, // Healing Wave
  1064: true,
  10622: true,
  10623: true, // Chain Heal
};

export const talents = {
  "Healing Grace": {
    maxRank: 3,
    coeff: (_, rank = 3, spellId) =>
      getThreatCoefficient(1 - 0.05 * rank * (spellId in HEALING_SPELLS)),
  },
};

export const fixateBuffs = {
  [config.Spell.EarthShockTaunt]: true,
};

export const spellFunctions = {
  [config.Spell.EarthShockR1]: handler_modDamage(config.Mods.EarthShock),
  [config.Spell.EarthShockR2]: handler_modDamage(config.Mods.EarthShock),
  [config.Spell.EarthShockR3]: handler_modDamage(config.Mods.EarthShock),
  [config.Spell.EarthShockR4]: handler_modDamage(config.Mods.EarthShock),
  [config.Spell.EarthShockR5]: handler_modDamage(config.Mods.EarthShock),
  [config.Spell.EarthShockR6]: handler_modDamage(config.Mods.EarthShock),
  [config.Spell.EarthShockR7]: handler_modDamage(config.Mods.EarthShock),
  [config.Spell.EarthShockTaunt]: handler_modDamage(config.Mods.EarthShock),

  [config.Spell.MoltenBlast]: handler_modDamage(config.Mods.MoltenBlast),
};

/**
 * @param {import("../era/threat/wcl").WCLCombatantInfo} unit
 * @param {Record<string, boolean>} buffs
 * @param {Record<string, number>} talents
 */
export const combatantImplications = (unit, buffs, talents) => {
  if (
    gearSetCount(unit.gear, config.Tier.TAQ_Tank) >= 4 ||
    gearHasTempEnchant(unit.gear, config.Enchant.SouOfTheAlpha)
  ) {
    buffs[config.Buff.TAQ_Tank_4pc] = true;
  }

  if (gearHasTempEnchant(unit.gear, config.Enchant.RockbiterWeapon)) {
    // TODO: shield detection
    buffs[config.Buff.ActivateWayOfEarth] = true;
  }
};

export const notableBuffs = {
  ...Object.values(config.Buff),
};

export const invulnerabilityBuffs = {};

export const auraImplications = {
  [config.Spell.MoltenBlast]: config.Buff.SpiritOfTheAlpha,
};
