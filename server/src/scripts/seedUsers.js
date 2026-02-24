const users = [
    {
        name: "Aarav Sharma",
        email: "aarav.sharma1@email.com",
        password: "123456",
        role: "employee"
    },
    { name: "Riya Patel", email: "riya.patel2@email.com", password: "123456", role: "manager" },
    { name: "Karan Mehta", email: "karan.mehta3@email.com", password: "123456", role: "employee" },
    { name: "Sneha Verma", email: "sneha.verma4@email.com", password: "123456", role: "employee" },
    { name: "Aditya Rao", email: "aditya.rao5@email.com", password: "123456", role: "manager" },
    {
        name: "Ishita Kapoor",
        email: "ishita.kapoor6@email.com",
        password: "123456",
        role: "employee"
    },
    { name: "Rahul Nair", email: "rahul.nair7@email.com", password: "123456", role: "employee" },
    { name: "Meera Joshi", email: "meera.joshi8@email.com", password: "123456", role: "manager" },
    {
        name: "Vikram Singh",
        email: "vikram.singh9@email.com",
        password: "123456",
        role: "employee"
    },
    { name: "Ananya Das", email: "ananya.das10@email.com", password: "123456", role: "employee" },

    { name: "Rohan Gupta", email: "rohan.gupta11@email.com", password: "123456", role: "employee" },
    { name: "Priya Nair", email: "priya.nair12@email.com", password: "123456", role: "manager" },
    {
        name: "Arjun Malhotra",
        email: "arjun.malhotra13@email.com",
        password: "123456",
        role: "employee"
    },
    {
        name: "Neha Kulkarni",
        email: "neha.kulkarni14@email.com",
        password: "123456",
        role: "employee"
    },
    {
        name: "Siddharth Roy",
        email: "siddharth.roy15@email.com",
        password: "123456",
        role: "manager"
    },
    { name: "Pooja Iyer", email: "pooja.iyer16@email.com", password: "123456", role: "employee" },
    {
        name: "Manish Chawla",
        email: "manish.chawla17@email.com",
        password: "123456",
        role: "employee"
    },
    { name: "Kavya Reddy", email: "kavya.reddy18@email.com", password: "123456", role: "manager" },
    {
        name: "Harsh Vardhan",
        email: "harsh.vardhan19@email.com",
        password: "123456",
        role: "employee"
    },
    { name: "Tanvi Shah", email: "tanvi.shah20@email.com", password: "123456", role: "employee" }
];

const registerUsers = async () => {
    for (const user of users) {
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (response.ok) {
                console.log(`Registered: ${user.email}`);
            } else {
                console.log(`Failed: ${user.email}`, data);
            }
        } catch (error) {
            console.log(`Error: ${user.email}`, error.message);
        }
    }
};

registerUsers();
