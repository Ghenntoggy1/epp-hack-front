import { useAppDispatch, useComparison } from "@/lib/hooks";
import { addOffer, removeOffer, toggleOffer } from "@/lib/slices/comparisonSlice";
import { Offer } from "@/types";
import { Button } from "@nextui-org/react";
import { Scale } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import queryString from "query-string";
import { useMemo } from "react";
import Highlighter from "react-highlight-words";
import toast from "react-hot-toast";

const FooterItem = ({ field, value }: { field: string; value: string }) => (
  <p className="text-body-md">
    {field}
    <span className="ml-2 font-medium text-primary-800">{value}</span>
  </p>
);

const formatDate = (date: string) => {
  //   const dateObj = new Date(date);
  //   return dateObj.toLocaleDateString("en-US", {
  //     day: "numeric",
  //     month: "short",
  //     year: "numeric"
  //   });
  return date;
};

interface OfferCardProps {
  offer: Offer;
  showCompare?: boolean;
  viewMore?: boolean;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  showCompare = true, // Default value set here
  viewMore = true
}) => {
  const {
    id,
    offer_name: title,
    country_name: country,
    city_name: city,
    university_name: university,
    description,
    offer_end_date: endDate,
    offer_start_date: startDate,
    scholarship,
    language,
    program_start: programStart,
    program_end: programEnd,
    receiver_name: receiver
  } = offer;

  const { query, pathname, push } = useRouter();
  const searchTerm = query.searchTerm as string;

  const dispatch = useAppDispatch();
  const { offers } = useComparison();

  const isOfferInComparison = offers.some((o) => o.id === offer.id);

  const handleToggleOffer = () => {
    const index = offers.findIndex((o: any) => o.id === offer.id);
    if (index !== -1) {
      dispatch(removeOffer(offer.id));
      toast.success("Offer removed from comparison");
    } else {
      if (offers.length === 2) {
        toast.error("You can only compare 2 programmes");
        return;
      }

      dispatch(addOffer(offer));
      toast.success("Offer added to comparison");
    }
  };

  return (
    <div className="border-stroke rounded-[10px] border bg-white shadow-sm">
      <div className="mx-card flex items-start justify-between pb-7 pt-card">
        <div>
          <Highlighter
            searchWords={[searchTerm]}
            textToHighlight={title}
            highlightClassName="bg-white text-primary"
            className="text-body-md font-medium"
          />
          <p className="text text-sm">{university}</p>
          <p className="text text-sm">{`${city}, ${country}`}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/opportunities/${id}`}>
            {
              viewMore ? <Button color="primary">View more</Button> : null
              // <Button color="primary">Edit</Button>
            }
          </Link>
          {!viewMore ? (
            <>
              <Button color="primary">Edit</Button>
              <Button color="danger">Delete</Button>
            </>
          ) : null}
          {showCompare && (
            <Button
              isIconOnly
              color={isOfferInComparison ? "success" : undefined}
              title="Add to comparison"
              variant="flat"
              onClick={handleToggleOffer}
            >
              <Scale />
            </Button>
          )}
        </div>
      </div>

      <hr className="border-stroke mx-[15px] border" />

      <div className="mb-6 mt-4 space-y-[5px] px-card">
        <h4 className="text-body-md mb-[5px] font-medium text-primary-500">About offer</h4>
        <p className="text-body-sm line-clamp-4">{description}</p>
      </div>

      <div className="border-stroke mr-card flex space-x-[30px] border-t pb-[15px] pl-card pt-[13px]">
        <FooterItem field="Scolarship fee" value={`${scholarship} EUR`} />
        <FooterItem field="Application deadline" value={formatDate(endDate)} />
      </div>
    </div>
  );
};
