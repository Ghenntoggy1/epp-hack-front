import { Layout, OfferCard, StudentModal } from "@/components/uni";
import { useRouter } from "next/router";
import debounce from "lodash.debounce";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Checkbox, Input, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { Search } from "lucide-react";
import { Offer } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { offersApi } from "@/api/offer";
import { commonApi } from "@/api";
import { useCookies } from "react-cookie";

interface FilterOption {
  label: string;
  value: string;
  defaultValue?: string;
}

type FormData = {
  searchTerm: string;
  [key: string]: FilterOption | string;
};

const durationOptions = [
  { value: 3, label: "3 months" },
  { value: 6, label: "6 months" },
  { value: 9, label: "9 months" },
  { value: 12, label: "12 months" }
];

const languageOptions = [
  { value: "all", label: "All Languages" },
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "Spanish", label: "Spanish" }
];

const scholarshipOptions = [
  { value: "all", label: "All Scholarships" },
  { value: "1000", label: "€1000 per month" },
  { value: "1100", label: "€1100 per month" },
  { value: "1200", label: "€1200 per month" },
  { value: "900", label: "€900 per month" },
  { value: "950", label: "€950 per month" }
];

const countryOptions = [
  { value: "all", label: "All Countries" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Sweden", label: "Sweden" },
  { value: "Netherlands", label: "Netherlands" },
  { value: "Italy", label: "Italy" }
];

const cityOptions = [
  { value: "all", label: "All Cities" },
  { value: "Munich", label: "Munich" },
  { value: "Paris", label: "Paris" },
  { value: "Stockholm", label: "Stockholm" },
  { value: "Amsterdam", label: "Amsterdam" },
  { value: "Milan", label: "Milan" }
];

const Opportunities = () => {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [userDetails, setUserDetails] = useState({
    university: {
      name: "",
      id: ""
    },
    specialization: {
      id: "",
      name: ""
    },
    semester: 0
  });
  const [includeStudentDetailsForm, setIncludeStudentDetailsForm] = useState(true);

  const { data } = useQuery({
    queryKey: ["offers", router.query],
    queryFn: () =>
      offersApi.getOffers({
        // university: userDetails.university.id,
        // speciality: userDetails.specialization.id,
        // semester: userDetails.semester,
        searchTerm: router.query.searchTerm?.toString() || undefined,
        country: router.query.country?.toString() || undefined,
        city: router.query.city?.toString() || undefined,
        duration: router.query.duration?.toString() || undefined,
        category: router.query.category?.toString() || undefined,
        language: router.query.language?.toString() || undefined,
      }, token),
  });

  useEffect(() => {
    const userDetails = localStorage.getItem("student");
    if (userDetails) {
      setUserDetails(JSON.parse(userDetails));
      setIncludeStudentDetailsForm(true);
    } else {
      onOpen();
    }
  }, []);

  const removeStudentDetails = () => {
    localStorage.removeItem("student");
    // trigger reload
    setUserDetails({
      university: {
        name: "",
        id: ""
      },
      specialization: {
        id: "",
        name: ""
      },
      semester: 0
    });
  };

  const { register, control, watch, reset, getValues } = useForm<FormData>();
  const [cookie, setCookie] = useCookies(["token"]);
  const token = cookie.token;
  const { data: categoryOptions } = useQuery({
    queryKey: ["categories"],
    queryFn: () => commonApi.getCategories(token),
    select: (data) =>
      data.map((category: any) => ({ value: category.category_id, label: category.category_name }))
  });

  const { data: cityOptions } = useQuery({
    queryKey: ["cities"],
    queryFn: () => commonApi.getCities(token),
    select: (data) => data.map((city: any) => ({ value: city.city_id, label: city.city_name }))
  });

  // Update URL on form change
  const debouncedUpdateUrl = debounce(() => {
    const formFields = getValues();
    const newQuery: { [key: string]: string } = {};
    Object.keys(formFields).forEach((key) => {
      const formField = formFields[key];
      newQuery[key] =
        typeof formField === "object" && formField !== null ? formField.value : formField;
    });

    Object.keys(newQuery).forEach((key) => {
      if (newQuery[key] === "") {
        delete newQuery[key];
      }
    });

    delete newQuery.undefined;
    const search = queryString.stringify(newQuery);
    if (window.location.search !== `?${search}`) {
      router.replace({ pathname: router.pathname, search }, undefined, { shallow: true });
    }
  }, 500);

  const filters = [
    { name: "category", options: categoryOptions },
    { name: "duration", options: durationOptions },
    { name: "language", options: languageOptions },
    { name: "country", options: countryOptions },
    { name: "city", options: cityOptions },
    { name: "scholarship fee", options: scholarshipOptions }
  ];

  useEffect(() => {
    const queryParams = router.query;
    const formValues: { [key: string]: FilterOption | string } = {
      searchTerm: queryParams.searchTerm?.toString() || ""
    };

    filters.forEach(() => {
      const { name, options, defaultValue } = filters as any;
      const queryValue = queryParams[name]?.toString() || defaultValue || "all";
      if (queryValue) {
        const option = options?.find((o: any) => o.value === queryValue);
        formValues[name] = option || { value: queryValue, label: queryValue };
      }
    });

    reset(formValues);
  }, [router.query]);

  useEffect(() => {
    const subscription = watch(() => debouncedUpdateUrl());
    return () => subscription.unsubscribe();
  }, [watch, debouncedUpdateUrl]);

  return (
    <Layout title="Opportunities">
      <div className="min-h-screen bg-slate-50 pb-10">
        <div className="container">
          <h1 className="pt-12 text-4xl font-semibold">Erasmus+ Opportunities</h1>
          <p className="mb-10 pt-4">
            Expore, filter and compare the Erasmus+ opportunities available for you.
          </p>

          <div className="border-stroke rounded-[7px] border bg-white p-6">
            <form className="border-stroke space-y-4 border-b pb-[18px]">
              <Input
                placeholder="Search for opportunities"
                startContent={<Search className="text-text-secondary w-5" />}
                {...register("searchTerm")}
                size="lg"
              />
              <div className="grid grid-cols-6 gap-4">
                {filters.map((filter, index) => (
                  <Controller
                    key={index}
                    control={control}
                    render={({ field }) => (
                      <Select
                        size="sm"
                        label={`Select ${filter.name}`}
                        className="w-full"
                        onChange={(e) => {
                          console.log(filter.options);
                          // the value is the index of the keys
                          const value = filter.options[parseInt(e.target.value)].value;
                          // console.log(value, Object.keys(filter.options));
                          field.onChange(value);
                        }}
                        value={field.value as string}
                      >
                        {filter?.options?.map((option: any, index: number) => (
                          <SelectItem key={index} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                    {
                      ...register(filter.name)
                      // ref: null
                    }
                  />
                ))}
              </div>
              <div className="flex">
                {userDetails.university.name ? (
                  <>
                    <Checkbox
                      checked={true}
                      onChange={() => setIncludeStudentDetailsForm(!includeStudentDetailsForm)}
                    >
                      Include student details ({userDetails.university.name} -{" "}
                      {userDetails.specialization.name})
                    </Checkbox>
                    <span className="ml-2"> or</span>
                    <button
                      onClick={removeStudentDetails}
                      className="ml-2 text-primary-700 underline"
                    >
                      Remove student details
                    </button>
                  </>
                ) : (
                  <button onClick={onOpen} className="text-primary-700 underline" type="button">
                    Add student details
                  </button>
                )}
              </div>
            </form>
            <div className="mt-[26px] space-y-1">
              <h2 className="text-lg font-semibold text-primary-800">Recent searches</h2>
              <p className="text-sm font-medium">Total number of results found: {data?.length}</p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-6 pl-10 pr-[56px]">
              {data?.map((item: any, index: number) => <OfferCard offer={item} key={index} />)}
            </div>
          </div>
        </div>
      </div>
      <StudentModal open={isOpen} onClose={onOpenChange} onOpenChange={onOpenChange} />
    </Layout>
  );
};

export default Opportunities;
