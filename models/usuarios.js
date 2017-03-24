var  baseDatos = require("../config/bdLogin").baseDatos;
var usuarios = baseDatos.Model.extend({
    tableName : 'usuarios_tb',
    idAttribute: 'codUsiario'
});
module.exports = {usuarios:usuarios};