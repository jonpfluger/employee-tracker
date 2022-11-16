INSERT INTO department (name)
VALUES ("Manager");

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 85000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 75000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 70000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Nathan", "Johnson", 1, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Jackson", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jessie", "Jones", 3, 1);