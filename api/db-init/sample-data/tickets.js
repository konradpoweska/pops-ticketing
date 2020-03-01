const twoHours = (() => { let l = new Date(0); l.setHours(2); return l; })();

module.exports = [
  {
    _id: 1,
    created: new Date(1581536729000),
    lastEdit: new Date(1581619634000),
    creator: "Mira Van Emhyr",
    status: "IN_PROGRESS",
    progress: 0.5,

    title: "Rétablir l'accès",
    type: "I",
    client: "Vend Rêve",
    requester: "Jacques Spareaux",
    category: "Software",
    description: "Ça ne marche pas.",

    subTickets: [
      { _id: 2, weight: 1 }
    ]
  },
  {
    _id: 2,
    parentTicket: 1,
    created: new Date(1581536735000),
    lastEdit: new Date(1581619642000),
    creator: "Olgierd Von Everec",
    status: "IN_PROGRESS",

    title: "Réparer un tuyau.",
    type: "I",
    client: "Vend Rêve",
    requester: "Jacques Spareaux",
    category: "Réparation",
    description: "L'eau ne sort plus.",

    progress: 0.5,
    skills: [
      { name: "Plombier", level: 3 }
    ],
    estimatedDuration: twoHours,
    plannedIntervention: new Date(),
    technician: null,
    actualDuration: null,
    counterStart: null
  }
];
