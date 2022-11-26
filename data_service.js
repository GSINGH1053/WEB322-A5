const Sequelize = require('sequelize');
var employees = [];

var sequelize = new Sequelize('zsewfiyj', 'zsewfiyj', 'nYGX9VD2zmcdfiF_xw54FSaMp81_a006', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    },
    query: { raw: true }, // update here, you. Need this
    logging: false
});


// creating models

let Employee = sequelize.define('employees', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,

});

let Department = sequelize.define('departments', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING,
});

sequelize.authenticate().then(() => console.log('Connection to DB: Success.')).catch((err) => console.log("Connection to DB: Failed.", err));

exports.initialize = () => {
    var promise = new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve("Sync with database: Success");
        }).catch((err) => {
            reject("Unable to sync with database");
        });
    });
    return promise;
};

exports.getAllEmployees = () => {
    var promise = new Promise((resolve, reject) => {
        Employee.findAll().then((data) => {
            if (data.length < 1) {
                var err = "No data returned!";
                reject({ message: err });
            }
            resolve(data);
        }).catch((e) => {
            var err = "An error occured while fetching results from database.";
            reject({ message: err });
        });
    });
    return promise;
};

exports.getManagers = () => {
    return new Promise((resolve, reject) => {
        var managers = employees.filter(employee => employee.isManager == true);
        if (managers.length == 0) {
            reject('no results returned');
        }
        resolve(managers);
    })
};

exports.getDepartments = () => {
    return new Promise((resolve, reject) => {
        Department.findAll({}).then((data) => {
            if (data.length < 1) {
                var err = "No data returned!";
                reject({ message: err });
            }
            resolve(data);
        }).catch((e) => {
            var err = "Error while fetching results from database.";
            reject({ message: err });
        });
    });
};

exports.addEmployee = (employeeData) => {
    Object.keys(employeeData).forEach(key => {
        if (employeeData[key].trim() === "") {
            employeeData[key] = null
        }
    })

    employeeData.isManager == undefined ? employeeData.isManager = false : employeeData.isManager = true;

    return new Promise((resolve, reject) => {
        Employee.create(employeeData).then(function () {
            resolve(true);
        }).catch(function (err) {
            reject("Something went wrong while adding the Employee!");
        });
    })
};

exports.getEmployeeByStatus = (status) => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                status
            }
        }).then((data) => {
            if (data.length < 1) {
                var err = "No data returned!";
                reject({ message: err });
            }
            resolve(data);
        }).catch((e) => {
            var err = "Error while fetching results from database.";
            reject({ message: err });
        });
    });
};

exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                department
            }
        }).then((data) => {
            if (data.length < 1) {
                var err = "No data returned!";
                reject({ message: err });
            }
            resolve(data);
        }).catch((e) => {
            var err = "Error while fetching results from database.";
            reject({ message: err });
        });
    });
};

exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        }).then((data) => {
            if (data.length < 1) {
                var err = "No data returned!";
                reject({ message: err });
            }
            resolve(data);
        }).catch((e) => {
            var err = "Error while fetching results from database.";
            reject({ message: err });
        });
    });
};

exports.getEmployeeByNum = (value) => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeNum: value
            }
        }).then((data) => {
            if (data.length < 1) {
                var err = "No data returned!";
                reject({ message: err });
            }
            resolve(data);
        }).catch((e) => {
            var err = "Error while fetching results from database.";
            reject({ message: err });
        });
    });
};

exports.updateEmployee = (employeeData) => {
    let employeeNum = employeeData.employeeNum;
    Object.keys(employeeData).forEach(key => {
        if (employeeData[key].trim() === "") {
            employeeData[key] = null
        }
    })

    employeeData.isManager == undefined ? employeeData.isManager = false : employeeData.isManager = true;

    return new Promise((resolve, reject) => {
        Employee.update(employeeData, {
            where: { employeeNum }
        }).then(function () {
            resolve(true);
        }).catch(function (err) {
            reject("Something went wrong while updating the Employee!");
        });
    })
};



// new modules added - Assignment 5

exports.addDepartment = (departmentData) => {
    Object.keys(departmentData).forEach(key => {
        if (departmentData[key].trim() === "") {
            departmentData[key] = null
        }
    })

    return new Promise((resolve, reject) => {
        Department.create(departmentData).then(function () {
            resolve(true);
        }).catch(function (err) {
            reject("Something went wrong while adding the Department!");
        });
    })
};

exports.updateDepartment = (departmentData) => {
    let departmentId = departmentData.departmentId;
    Object.keys(departmentData).forEach(key => {
        if (departmentData[key].trim() === "") {
            departmentData[key] = null
        }
    })

    return new Promise((resolve, reject) => {
        Department.update(departmentData, {
            where: { departmentId }
        }).then(function () {
            resolve(true);
        }).catch(function (err) {
            console.log(err);

            reject("Something went wrong while updating the Department Data!");
        });
    })
};

exports.getDepartmentById = (departmentId) => {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: { departmentId }
        }).then((data) => {
            if (data.length < 1) {
                var err = "No data returned!";
                reject({ message: err });
            }
            resolve(data);
        }).catch((e) => {
            var err = "Error while fetching results from database.";
            reject({ message: err });
        });
    });
};

exports.deleteEmployeeByNum = (employeeNum) => {
    return new Promise((resolve, reject) => {
        Employee.destroy({
            where: {  employeeNum } 
        }).then(() => {
            resolve("Deleted");
        }).catch((e) => {
            
            var err = "An error occured while deleting employee.";
            reject({ message: err });
        });
    });
}