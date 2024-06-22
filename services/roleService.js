const db = require("../config/db");

module.exports.getAllRoles = async () => {
  const [records] = await db.query("SELECT * FROM roles");
  return records;
};

module.exports.getRoleByID = async (id) => {
  const [records] = await db.query(
    "SELECT * FROM roles WHERE roleID = ?",
    [id]
  );
  return records;
};

module.exports.deleteRole = async (id) => {
  const [{ affectedRows }] = await db.query(
    "DELETE FROM roles WHERE roleID = ?",
    [id]
  );
  return affectedRows;
};

module.exports.createRole = async (roleData) => {
  const {
    roleID,
    roleName,
    roleStatus,
    createdDate,
    roleDescription,
    ruleRights,
  } = roleData;

  const [result] = await db.query(
    "INSERT INTO roles (roleID, roleName, roleStatus, createdDate, roleDescription, ruleRights) VALUES (?, ?, ?, ?, ?, ?)",
    [
      roleID,
      roleName,
      roleStatus,
      createdDate,
      roleDescription,
      ruleRights,
    ]
  );

  return result.insertId;
};

module.exports.updateRole = async (update, id) => {
  const {
    roleName = update.roleName,
    roleStatus = update.roleStatus,
    createdDate = update.createdDate,
    roleDescription = update.roleDescription,
    ruleRights = update.ruleRights,
  } = update;

  const [result] = await db.query(
    'UPDATE roles SET roleName = ?, roleStatus = ?, createdDate = ?, roleDescription = ?, ruleRights = ? WHERE roleID = ?',
    [
      roleName,
      roleStatus,
      createdDate,
      roleDescription,
      ruleRights,
      id,
    ]
  );

  return result.affectedRows;
};

module.exports.getRoleByName = async (name) => {
  const [records] = await db.query(
    "SELECT * FROM roles WHERE roleName = ?",
    [name]
  );
  return records;
};