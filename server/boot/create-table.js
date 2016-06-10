module.exports = function(app) {
  app.dataSources.mysqlDS.automigrate('application', function(err) {
    if (err) throw err;
 
    app.models.application.create([
      {name: 'guidewire', description: 'Vancouver'},
      {name: 'libre', description: 'San Mateo'},
      {name: 'loopback', description: 'Vancouver'},
    ], function(err, applications) {
      if (err) throw err;
 
      console.log('Models created: \n', applications);
    });
  });
};