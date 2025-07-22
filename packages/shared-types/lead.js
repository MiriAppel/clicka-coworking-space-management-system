// lead-types.d.ts
// Lead status enum
export var LeadStatus;
(function (LeadStatus) {
    LeadStatus["NEW"] = "NEW";
    LeadStatus["CONTACTED"] = "CONTACTED";
    LeadStatus["INTERESTED"] = "INTERESTED";
    LeadStatus["SCHEDULED_TOUR"] = "SCHEDULED_TOUR";
    LeadStatus["PROPOSAL_SENT"] = "PROPOSAL_SENT";
    LeadStatus["CONVERTED"] = "CONVERTED";
    LeadStatus["NOT_INTERESTED"] = "NOT_INTERESTED";
    LeadStatus["LOST"] = "LOST";
})(LeadStatus || (LeadStatus = {}));
// Lead source enum
export var LeadSource;
(function (LeadSource) {
    LeadSource["WEBSITE"] = "WEBSITE";
    LeadSource["REFERRAL"] = "REFERRAL";
    LeadSource["SOCIAL_MEDIA"] = "SOCIAL_MEDIA";
    LeadSource["EVENT"] = "EVENT";
    LeadSource["PHONE"] = "PHONE";
    LeadSource["WALK_IN"] = "WALK_IN";
    LeadSource["EMAIL"] = "EMAIL";
    LeadSource["OTHER"] = "OTHER";
})(LeadSource || (LeadSource = {}));
// Lead interaction type enum
export var InteractionType;
(function (InteractionType) {
    InteractionType["EMAIL"] = "EMAIL";
    InteractionType["PHONE"] = "PHONE";
    InteractionType["MEETING"] = "MEETING";
    InteractionType["TOUR"] = "TOUR";
    InteractionType["NOTE"] = "NOTE";
    InteractionType["DOCUMENT"] = "DOCUMENT";
})(InteractionType || (InteractionType = {}));
