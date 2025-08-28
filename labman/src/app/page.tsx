import prisma from '@/lib/prisma';

export default async function Home() {
  const equipment = await prisma.equipment.findMany();
  console.log(equipment);

  async function addEquipment(formData : FormData) {
      "use server"
      const name = formData.get("name") as string;
      const category = formData.get("category") as string;
      const image = formData.get("image") as string;
      const quantity = formData.get("quantity");
      const available = formData.get("available");

        await prisma.equipment.create({
            data: {
                name,
                category,
                image,
                quantity: Number(quantity),
                available: Number(available)
            }
        });

  }
  return (
      <div>
        <h1>{equipment[0].name}</h1>
        <form action={addEquipment}>
            <input type="text" name="name" placeholder="Name" />
            <input type="text" name="category" placeholder="Category" />
            <input type="text" name="image" placeholder="Image" />
            <input type="number" name="quantity" placeholder="Quantity" />
            <input type="number" name="available" placeholder="Available" />
            <button type="submit">Add Equipment</button>

        </form>
      </div>

  );
}
