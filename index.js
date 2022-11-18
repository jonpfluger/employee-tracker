import mysql from 'mysql2'
import inquirer from "inquirer"

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_tracker_db'
})

const showSUM = async () => {
    try {
        const [results] = await connection.promise().query(`SELECT department_id, SUM(salary) AS total_budget FROM role GROUP BY department_id`)
        console.table(results)
        menuPrompt()
    } catch(err) {
        throw new Error(err)
    }
}

const showDepartments = async () => {
    try {
        const [results] = await connection.promise().query(`SELECT * FROM department`)
        console.table(results)
        menuPrompt()
    } catch(err) {
        throw new Error(err)
    }
}

const showRoles = async () => {
    try {
        const [results] = await connection.promise().query(`SELECT * FROM role`)
        console.table(results)
        menuPrompt()
    } catch(err) {
        throw new Error(err)
    }
}

const showEmployees = async () => {
    try {
        const [results] = await connection.promise().query(`SELECT * FROM employee`)
        console.table(results)
        menuPrompt()
    } catch(err) {
        throw new Error(err)
    }
}

const addDepartment = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Department name: '
        }
    ])

    try {
        const [results] = await connection.promise().query(`INSERT INTO department (name) VALUES (?)`, answers.name)
    } catch(err) {
        throw new Error(err)
    }

    console.log('Department added!')
    menuPrompt()
}

const deleteDepartment = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Department name: '
        }
    ])

    try {
        const [results] = await connection.promise().query(`DELETE FROM department WHERE name=?`, answers.name)
    } catch(err) {
        throw new Error(err)
    }

    console.log('Department deleted!')
    menuPrompt()
}

const addRole = async () => {
    connection.query("SELECT * FROM department", async (err, res) => {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Role title: '
            },
            {
                type: 'number',
                name: 'salary',
                message: 'Salary (Ex 75000): '
            },
            {
                type: 'list',
                name: 'departmentName',
                message: 'Department name: ',
                choices: res.map(department => department.name)
            }
        ])

        try {
            const department = res.find(department => department.name === answers.departmentName)
            const [results] = await connection.promise().query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.title, answers.salary, department.id])
        } catch(err) {
            throw new Error(err)
        }

        console.log('Role added!')
        menuPrompt()
    })
}

const deleteRole = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Role title: '
        }
    ])

    try {
        const [results] = await connection.promise().query(`DELETE FROM role WHERE title=?`, answers.title)
    } catch(err) {
        throw new Error(err)
    }

    console.log('Role deleted!')
    menuPrompt()
}

const addEmployee = async () => {
    connection.query("SELECT * FROM role", async (err, res) => {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'First name: '
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Last name: '
            },
            {
                type: 'list',
                name: 'roleName',
                message: 'Role name: ',
                choices: res.map(role => role.title)
            }
        ])

        try {
            const role = res.find(role => role.title === answers.roleName)
            const [results] = await connection.promise().query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`, [answers.first_name, answers.last_name, role.id])
        } catch(err) {
            throw new Error(err)
        }

        console.log('Employee added!')
        menuPrompt()
    })
}

const deleteEmployee = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Employee ID: '
        }
    ])

    try {
        const [results] = await connection.promise().query(`DELETE FROM employee WHERE id=?`, answers.id)
    } catch(err) {
        throw new Error(err)
    }

    console.log('Employee deleted!')
    menuPrompt()
}

const updateEmployeeRole = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'number',
            name: 'id',
            message: 'Which Employee do you want to update? (ID)'
        },
        {
            type: 'number',
            name: 'role_id',
            message: 'Update role (ID)',
            default: async (sessionAnswers) => {
                const [results] = await connection.promise().query(`SELECT role_id FROM employee WHERE id = ?`, sessionAnswers.id)
                return results[0].role_id
            }
        }
    ])
    
    const [results] = await connection.promise().query(`UPDATE Employee SET role_id = ? WHERE id = ?`, [answers.role_id, answers.id])

    console.log("Employee updated!")
    menuPrompt()
}


const menuPrompt = async () => {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What do you want to do?",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Delete a department", "Add a role", "Delete a role", "Add an employee", "Delete an employee", "Update an employee role", "Show total budget of each department", "Exit"]
        },
    ])

    if (answers.action === 'View all departments') {
        showDepartments()
    } else if (answers.action === 'View all roles') {
        showRoles()
    } else if (answers.action === "View all employees") {
        showEmployees()
    } else if (answers.action === "Add a department") {
        addDepartment()
    } else if (answers.action === "Delete a department") {
        deleteDepartment()
    } else if (answers.action === "Add a role") {
        addRole()
    } else if (answers.action === "Delete a role") {
        deleteRole()
    } else if (answers.action === "Add an employee") {
        addEmployee()
    } else if (answers.action === "Delete an employee") {
        deleteEmployee()
    } else if (answers.action === "Update an employee role") {
        updateEmployeeRole()
    } else if (answers.action === "Show total budget of each department") {
        showSUM()
    } else {
        process.exit(0)
    }
}

menuPrompt()