const exists = { $exists: true };
const doesNotExist = { $exists: false };
const isDate = { $type: 'date' };
const isDateOrNull = prop => ({ $or: [ { [prop]: isDate }, { [prop]: null } ] })

module.exports = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['_id', 'status', 'title', 'creator', 'category', 'created', 'lastEdit', 'type',
      'client', 'requester', 'description', 'progress'],
    additionalProperties: false,
    properties: {
      _id: { bsonType: 'int' },
      parentTicket: { bsonType: 'int'},
      created: {},
      lastEdit: {},
      creator: { bsonType: 'string' },
      status: { enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CLOSED_SUCCESS', 'CLOSED_ABORTED', 'DELETED'] },
      title: { bsonType: 'string' },
      type: { enum: ['I', 'Q'] },
      client: { bsonType: 'string' },
      requester: { bsonType: 'string' },
      category: { bsonType: 'string' },
      description: { bsonType: 'string' },
      progress: { bsonType: 'number' },

      subTickets: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: ['_id', 'weight'],
          additionalProperties: false,
          properties: {
            _id: { bsonType: 'int' },
            weight: { bsonType: 'int' }
          }
        },
      },

      skills: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: ['name', 'level'],
          additionalProperties: false,
          properties: {
            name: { bsonType: 'string' },
            level: { bsonType: 'int' }
          }
        }
      },
      estimatedDuration: {},
      plannedIntervention: {},
      technician: { bsonType: ['string', 'null'] },
      actualDuration: {},
      counterStart: {}
    }
  },
  created: isDate,
  lastEdit: isDate,
  $or: [
    {
      subTickets: exists,
      skills: doesNotExist, estimatedDuration: doesNotExist,
      plannedIntervention: doesNotExist, technician: doesNotExist,
      actualDuration: doesNotExist, counterStart: doesNotExist
    },
    {
      subTickets: doesNotExist,
      skills: exists,
      technician: exists,
      $and: [
        isDateOrNull('estimatedDuration'),
        isDateOrNull('plannedIntervention'),
        isDateOrNull('actualDuration'),
        isDateOrNull('counterStart')
      ],
    }
  ]
};
