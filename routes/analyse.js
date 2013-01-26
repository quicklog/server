exports.getitems = function(req, res) {
  var data = [
        {
          "x": "Procedure 1",
          "y": 4
        },
        {
          "x": "Procedure 2",
          "y": 8
        }
      ];
      
  res.send(data);
};