var aggregatePipeline = [
  {$match: {
    $or: [{type:'EXPENSE'}, {type:'INCOME'}]
  }},
  {$group: {
    _id: {type:'$type', category: '$category'},
    count: {$sum: 1},
    amount: {$sum: '$amount'}
  }},
  //project es como un select de los querys osea solo muestra 
  //los campos que uno quiere
  {$project: {
    _id:1,
    count:1,
    amount:1
  }},
  {
    //define en que orden van a parecer los registros
    $sort: {
      '_id.type': 1,
      'amount': -1
    }
  }
];


db.cashFlow.aggregate(aggregatePipeline);






// $match  $group  $project $sort