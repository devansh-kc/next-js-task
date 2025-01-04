import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  image: string;
  name: string;
  description: string;
  productId: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  productId,
  description,
}) => {
  return (
    <Card>
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-md"
      />
      <CardHeader>
        <h2 className="mt-4 text-xl font-semibold ">{name}</h2>
      </CardHeader>
      <CardContent>
        <p className="mt-2 ">{description}</p>
      </CardContent>
      <div className=" flex  items-center m-2 p-2">
        <CardFooter>
          <Button className="mx-2 my-2">Edit Product</Button>
          <Button className="mx-2 my-2"> Delete Product </Button>
        </CardFooter>
      </div>
    </Card>
  );
};
