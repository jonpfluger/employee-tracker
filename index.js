import mysql from 'mysql2'
import inquirer from "inquirer"

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_tracker_db'
})

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

const addRole = async () => {
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
        }
    ])

    try {
        const [results] = await connection.promise().query(`INSERT INTO role (title, salary) VALUES (?, ?)`, [answers.title, answers.salary])
    } catch(err) {
        throw new Error(err)
    }

    console.log('Role added!')
    menuPrompt()
}

const addEmployee = async () => {
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
    ])

    try {
        const [results] = await connection.promise().query(`INSERT INTO employee (first_name, last_name) VALUES (?, ?)`, [answers.first_name, answers.last_name])
    } catch(err) {
        throw new Error(err)
    }

    console.log('Employee added!')
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
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Exit"]
        },
    ])

    console.log(answers)
    if (answers.action === 'View all departments') {
        showDepartments()
    } else if (answers.action === 'View all roles') {
        showRoles()
    } else if (answers.action === "View all employees") {
        showEmployees()
    } else if (answers.action === "Add a department") {
        addDepartment()
    } else if (answers.action === "Add a role") {
        addRole()
    } else if (answers.action === "Add an employee") {
        addEmployee()
    } else if (answers.action === "Update an employee role") {
        updateEmployeeRole()
    } else {
        process.exit(0)
    }
}

menuPrompt()