/* eslint-disable @next/next/no-img-element */
// This component displays and enables the purchase of a product

// Importing the dependencies
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
// Import ethers to format the price of the product correctly
import { ethers } from "ethers";
// Import the useConnectModal hook to trigger the wallet connect modal
import { useConnectModal } from "@rainbow-me/rainbowkit";
// Import the useAccount hook to get the user's address
import { useAccount } from "wagmi";
// Import the toast library to display notifications
import { toast } from "react-toastify";
// Import our custom identicon template to display the owner of the product
import { identiconTemplate } from "@/helpers";
// Import our custom hooks to interact with the smart contract
import { useContractApprove } from "@/hooks/contracts/useApprove";
import { useContractSend } from "@/hooks/contracts/useContractWrite";
import { useGetFavourite, useDeleteFavourite } from "@/hooks/contracts/useContractFavourite";

// Define the interface for the product, an interface is a type that describes the properties of an object
interface Favourite {
  name: string;
  price: number;
  owner: string;
  image: string;
  description: string;
  location: string;
  sold: boolean;
}

// Define the Favourite component which takes in the id of the product and some functions to display notifications
const Favourite = ({id, setError, setLoading }: any) => {
  // Use the useAccount hook to store the user's address
  const { address } = useAccount();
  // Use the useContractCall hook to read the data of the product with the id passed in, from the marketplace contract
  const { data: rawProduct }: any = useGetFavourite([address, id], true);
  // Use the useContractSend hook to purchase the product with the id passed in, via the marketplace contract
  const { writeAsync: deleteFavourite }:any = useDeleteFavourite([id]);
  
  const [product, setProduct] = useState<Favourite | null>(null);  


  // Use the useConnectModal hook to trigger the wallet connect modal
  const { openConnectModal } = useConnectModal();
  // Format the product data that we read from the smart contract
  const getFormatProduct = useCallback(() => {
    if (!rawProduct) return null;
    if(rawProduct.owner !== "0x0000000000000000000000000000000000000000") {
      setProduct({
        owner: rawProduct[0],
        name: rawProduct[1],
        image: rawProduct[2],
        description: rawProduct[3],
        location: rawProduct[4],
        price: Number(rawProduct[5]),
        sold: rawProduct[6].toString()
      });
    } else {
      setProduct(null);
    }
  }, [rawProduct]);

  // Call the getFormatProduct function when the rawProduct state changes
  useEffect(() => {
    getFormatProduct();
  }, [getFormatProduct]);

  // Delete food from favourite
  const handleDeleteFavourite = async () => {
    setLoading("Deleting from favourite...");
    try {
      // If the user is not connected, trigger the wallet connect modal
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }
      // If the user is connected, call the handlePurchase function and display a notification
      await toast.promise(deleteFavourite(), {
        pending: "Deleting favourite...",
        success: "Deleted favourite successfully",
        error: "Failed to delete from favourite",
      });
      // If there is an error, display the error message
    } catch (e: any) {
      console.log({ e });
      setError(e?.reason || e?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(null);
    }
  }

  // If the product cannot be loaded, return null
  if (!product) return null;

  // Format the price of the product from wei to cUSD otherwise the price will be way too high
  const productPriceFromWei = ethers.utils.formatEther(
    product.price.toString()
  );

  // Return the JSX for the product component
  return (
    <div className="flex h-24 overflow-hidden items-start justify-between shadow-lg relative rounded-b-lg">
      <div className="relative w-2/6 h-full">
        {/* Show the number of products sold */}
        <span
          className={
            "absolute z-10 right-0 mt-4 bg-slate-300 text-black font-bold p-1 rounded-l-lg px-2 shadow text-sm"
            }
          >
            {product.sold} sold
          </span>
          {/* Show the product image */}
          <img
            src={product.image}
            alt={"image"}
            className="w-full h-full rounded-t-md object-cover object-center group-hover:opacity-75"
          />
        </div>

        <div className={"relative px-4 pb-4 w-4/6 h-full flex flex-col justify-between"}>
          <div className="flex items-center justify-between">
            <div
              onClick={handleDeleteFavourite}
              className="absolute cursor-pointer right-4 top-3"
            >
              <img width="16" height="16" src="https://img.icons8.com/color/48/000000/delete-sign--v1.png" alt="delete-sign--v1"/>
            </div>
            {/* Show the product name */}
            <p className="m-0 text-2xl font-bold">{product.name}</p>
          </div>

          <div className="flex justify-between items-start flex-col flex-wrap gap-4">
            <div className={"flex items-center justify-between flex-row"}>
              {/* Show the product location */}
              <h3 className="pt-1 -ml-1 flex items-center justify-start text-sm text-gray-700">
                <img src={"/location.svg"} alt="Location" className={"w-6"} />
                {product.location}
              </h3>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Favourite;