"use strict";


const {
    EffectTrigger
} = require("../../effects/models/effectModels");


/**
 * The $subMonths variable
 */

let triggers = {};
triggers[EffectTrigger.COMMAND] = true;
triggers[EffectTrigger.MANUAL] = true;

const model = {
    definition: {
        handle: "commandTrigger",
        description: "The trigger of the issued command.",
        triggers: triggers
    },
    evaluator: (trigger) => {
        return trigger.metadata.userCommand.trigger;
    }
};

module.exports = model;