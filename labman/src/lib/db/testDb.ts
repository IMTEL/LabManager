import prisma from "@/lib/prisma";

const user = await prisma.user.create({
    data: {
        username: "test",
        hashedPassword: "$2b$10$G0eD8a8Bqx5xfHDGTvUclerrLPy7FBu4dGR7Z8E67T7VtGH6lbJ7u"
    }
})

console.log(user)