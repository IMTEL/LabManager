import prisma from "@/lib/prisma";

export default async function Users() {

    async function addUser(formData : FormData) {
        "use server"
        const username = formData.get("name") as string;
        const password = formData.get("password") as string;

        await prisma.user.create({
            data: {
                username,
                password
            }
        })
    }

    return(
        <div>
            <form action={addUser}>
                <input type="text" name="name" placeholder="Name" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Add User</button>

            </form>
        </div>
    )
}