import { commonApi } from "@/api";
import { offersApi } from "@/api/offer";
import { Layout } from "@/components/uni";
import { CoursesPanel } from "@/components/uni/offer/CoursesPanel";
import { useAppDispatch, useComparison } from "@/lib/hooks";
import { addOffer, removeOffer } from "@/lib/slices/comparisonSlice";
import { Offer, SpecializationCourses } from "@/types";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Divider,
  useDisclosure,
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  ModalContent,
  ModalFooter
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookA,
  CircleDollarSign,
  Link,
  Mail,
  MapPin,
  Scale,
  Timer,
  University,
  Link as LinkIcon
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const formatDate = (date?: string) => {
  // if (!date) return "";
  // return new Date(date).toLocaleDateString("en-US", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric"
  // });
  return date;
};

const livingIndices = [0, 1, 28, 36, 48];

const OfferPage = () => {
  const router = useRouter();

  const [studentDetails, setStudentDetails] = useState({
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

  console.log(studentDetails);

  const { data } = useQuery({
    queryKey: ["offer", router.query.id],
    queryFn: () => offersApi.getOfferById(router.query.id as string)
  });
  console.log(data);
  const { data: specializationCourses } = useQuery({
    queryKey: ["specs", router.query.specialization],
    queryFn: () =>
      offersApi.getSpecializationById(studentDetails?.specialization?.id as string, {
        specialization_id: router.query.specialization,
        sem: studentDetails?.semester
      }),
    enabled: !!router.query.specialization
  });

  const {
    offer_name,
    description,
    offer_end_date,
    offer_start_date,
    scholarship,
    language,
    receiver_name,
    specializations,
    city_name,
    country_name,
    program_end,
    program_start
  } = data || {};

  const { specialization } = router.query;

  useEffect(() => {
    // from local storage local
    const student = localStorage.getItem("student");
    if (student) {
      setStudentDetails(JSON.parse(student));
    }
  }, []);

  const { data: costOfLiving } = useQuery({
    queryFn: () => commonApi.getCostOfLiving(data?.city_name, data?.country_name),
    queryKey: ["costOfLiving", "Milan", "Italy"],
    enabled: !!data?.city_name && !!data?.country_name,
    select: (data: any) => data.cost_of_living_details?.[0].details
  });

  const handleBack = () => {
    router.push("/opportunities");
  };

  const onClickSpecialization = (id: string) => {
    router.push(`/opportunities/${router.query.id}?specialization=${id}`);
  };

  useEffect(() => {
    if (specialization) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [specialization]);

  const { offers } = useComparison();
  const dispatch = useAppDispatch();
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm({
    mode: "onChange"
  });

  const onSubmit = (data: any) => {
    console.log(data);
    onClose();
    toast.success("Reminder set successfully");
  };

  console.log(costOfLiving);

  const handleToggleOffer = () => {
    const index = offers.findIndex((o: any) => o.id === data.id);
    if (index !== -1) {
      dispatch(removeOffer(data.id));
      toast.success("Offer removed from comparison");
    } else {
      if (offers.length === 2) {
        toast.error("You can only compare 2 programmes");
        return;
      }

      dispatch(addOffer(data));
      toast.success("Offer added to comparison");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <Layout title={data?.offer_name}>
      <div className="min-h-screen bg-slate-50 pb-10">
        <div className="container max-w-screen-xl">
          <div className="mb-10 flex justify-between space-x-10 pt-12">
            <div>
              <div className="flex items-center space-x-4 ">
                <Button isIconOnly variant="light" onClick={handleBack}>
                  <ArrowLeft />
                </Button>
                <h1 className="text-4xl font-semibold">{offer_name}</h1>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button
                color={offers.some((o) => o.id === data?.id) ? "success" : "primary"}
                endContent={<Scale />}
                onClick={handleToggleOffer}
              >
                {offers.some((o) => o.id === data?.id)
                  ? "Added to comparison"
                  : "Add to comparison"}
              </Button>
              <Button color="primary" variant="flat" endContent={<Mail />} onClick={onOpen}>
                Deadline Reminder
              </Button>
              <Button isIconOnly onClick={handleCopyLink}>
                <LinkIcon />
              </Button>
            </div>
          </div>

          <div className="flex justify-between space-x-10">
            <div>
              <div className="mb-10 flex items-stretch gap-8">
                <div className="flex-1">
                  <div
                    className="h-[600px] w-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        'url("https://www.wur.nl/upload/0c6e6bbc-9d45-445c-85cb-4324911db463_320009834_1350605529082720_8930238375430677250_n.jpg")'
                    }}
                  />
                </div>
                <div className="flex-1 space-y-8">
                  <div
                    className="h-[280px] w-auto bg-cover bg-center"
                    style={{
                      backgroundImage:
                        'url("https://backoffice.museovirtuale.unimi.it/museovirtuale/assets/hnw29vbfe5ss08sc?key=directus-large-contain")'
                    }}
                  />
                  <div
                    className="h-[288px] w-auto bg-cover bg-center"
                    style={{
                      backgroundImage:
                        'url("https://www.iesabroad.org/sites/default/files/styles/media_gallery_preview/public/2023-04/306362514_126281153504552_6843181329021155925_n.jpg?h=dec22bcf&itok=UEMfGqAD")'
                    }}
                  />
                </div>
              </div>

              <div className="mb-5 space-y-1">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold uppercase text-primary-800">Overview</h2>
                  <div className="w-full flex-1">
                    <Divider />
                  </div>
                </div>
                <p className="text-lg">{description}</p>
              </div>

              <div className="mb-5 space-y-1">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold uppercase text-primary-800">
                    Programme Timeframe
                  </h2>
                  <div className="w-full flex-1">
                    <Divider />
                  </div>
                </div>
                <p className="text-lg">
                  From <span className="font-semibold">{formatDate(program_start)}</span> to{" "}
                  <span className="font-semibold">{formatDate(program_end)}</span>
                </p>
              </div>

              <div className="mb-5 mt-6 space-y-1">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold uppercase text-primary-800">
                    Specialties programmes
                  </h2>
                  <div className="w-full flex-1">
                    <Divider />
                  </div>
                </div>
                <ul className="list-inside list-decimal text-lg">
                  {specializations?.map((specialization: any) => (
                    <li
                      key={specialization.speicialization_id}
                      onClick={() => onClickSpecialization(specialization.specialization_id)}
                      className="w-fit cursor-pointer text-primary-600 hover:text-primary-800"
                    >
                      {specialization.specialization_name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-5 mt-6 space-y-1">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold uppercase text-primary-800">
                    Recipent university
                  </h2>
                  <div className="w-full flex-1">
                    <Divider />
                  </div>
                </div>
                <p className="text-lg">University of Milan</p>
              </div>

              <div className="mb-5 mt-6 space-y-1">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold uppercase text-primary-800">
                    CRITERIA FOR SUBMITTING THE APPLICATION FILE
                  </h2>
                  <div className="w-full flex-1">
                    <Divider />
                  </div>
                </div>
                <ul className="list-inside list-decimal text-lg">
                  <li>
                    Eligibility criteria: – to be a student enrolled at the Technical University of
                    Moldova.
                  </li>
                  <li>
                    Selection criteria:
                    <ul className="list-inside list-decimal pl-4 text-lg">
                      <li>to meet the eligibility requirements.</li>
                      <li>
                        to have good academic results in the academic year prior to mobility and in
                        the last exam.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Specific criteria:
                    <ul className="list-inside list-decimal pl-4 text-lg">
                      <li>to have all the exams passed;</li>
                      <li>
                        to submit other documents requested by the selection board in addition;
                      </li>
                      <li>
                        to be able to demonstrate specific skills and abilities in accordance with
                        the work to be carried out at the partner university
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="mb-5 mt-6 space-y-1">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold uppercase text-primary-800">
                    APPLICATION FILE SHOULD CONTAIN:
                  </h2>
                  <div className="w-full flex-1">
                    <Divider />
                  </div>
                </div>
                <ul className="list-inside list-decimal text-lg">
                  <li>
                    Application addressed to the Rector of TUM and approved by the Dean of the
                    Faculty (it can be requested from the international relations officer of the
                    faculty).
                  </li>
                  <li>
                    Photocopy of passport. Passport should be valid for the whole period of
                    mobility.
                  </li>
                  <li>
                    Student certificate issued by the faculty secretariat, with the mention that
                    during the mobility period the candidate will have the status of student.
                  </li>
                  <li>Transcript of records issued by the faculty secretariat.</li>
                  <li>
                    Letter of motivation addressed to the Selection Committee, stating the main
                    reasons for the choice of mobility, the candidate’s study objectives for
                    mobility, the expected results (1-2 pages).
                  </li>
                  <li>Curriculum vitae (Europass form + photo).</li>
                  <li>
                    English/ language certificate (minimum B1 according to CEFR Common European
                    Framework of Reference for Languages).
                  </li>
                  <li>
                    Learning Agreement (LA) for Studies. The LA should be signed and endorsed by the
                    Head of the Study Program or the Dean of the Faculty.
                  </li>
                </ul>
              </div>

              <div className="mb-5 mt-6 space-y-1">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold uppercase text-primary-800">
                    Application process timeline
                  </h2>
                  <div className="w-full flex-1">
                    <Divider />
                  </div>
                </div>
                <p className="text-lg">
                  From <span className="font-semibold">{formatDate(offer_start_date)}</span> to{" "}
                  <span className="font-semibold">{formatDate(offer_end_date)}</span>
                </p>
              </div>

              <div className="mb-5 mt-6 space-y-1">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold uppercase text-primary-800">
                    Costs details based on city
                  </h2>
                  <div className="w-full flex-1">
                    <Divider />
                  </div>
                </div>
                {/* <p className="text-lg">
                  From <span className="font-semibold">{formatDate(offer_start_date)}</span> to{" "}
                  <span className="font-semibold">{formatDate(offer_end_date)}</span>
                </p> */}
                <ul className="list-disc">
                  {livingIndices.map((i, _) => (
                    <li key={i}>
                      <span className="font-bold">{costOfLiving?.[i].Item}</span>
                      {costOfLiving?.[i].Value} EUR
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="min-w-[30vh] space-y-2">
              <Card className="border px-2 py-1 !shadow-sm">
                <CardHeader className="flex gap-3">
                  <Button isIconOnly className="h-12 w-12">
                    <University />
                  </Button>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-primary-800">University</h2>
                    <p>{data?.university_name}</p>
                  </div>
                </CardHeader>
              </Card>
              <Card className="border px-2 py-1 !shadow-sm">
                <CardHeader className="flex gap-3">
                  <Button isIconOnly className="h-12 w-12">
                    <MapPin />
                  </Button>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-primary-800">Location</h2>
                    <p>
                      {city_name}, {country_name}
                    </p>
                  </div>
                </CardHeader>
              </Card>
              <Card className="border px-2 py-1 !shadow-sm">
                <CardHeader className="flex gap-3">
                  <Button isIconOnly className="h-12 w-12">
                    <BookA />
                  </Button>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-primary-800">Language</h2>
                    <p>{language}</p>
                  </div>
                </CardHeader>
              </Card>
              <Card className="border px-2 py-1 !shadow-sm">
                <CardHeader className="flex gap-3">
                  <Button isIconOnly className="h-12 w-12">
                    <CircleDollarSign />
                  </Button>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-primary-800">Scholarship Fee</h2>
                    <p>{scholarship} EUR</p>
                  </div>
                </CardHeader>
              </Card>
              <Card className="border px-2 py-1 !shadow-sm">
                <CardHeader className="flex gap-3">
                  <Button isIconOnly className="h-12 w-12">
                    <Timer />
                  </Button>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-red-500">Deadline</h2>
                    <p>{formatDate(offer_end_date)}</p>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {specialization && (
        <CoursesPanel
          data={specializationCourses}
          name={
            specializations?.find(
              (s: any) => s.specialization_id.toString() === specialization.toString()
            )?.specialization_name || ""
          }
          university={data?.university_name}
          onClose={() => router.push(`/opportunities/${router.query?.id}`)}
        />
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>Deadline Reminder</ModalHeader>
              <ModalBody>
                <p className="mb-2 text-sm">
                  The deadline for this offer is{" "}
                  <span className="font-semibold">{formatDate(offer_end_date)}</span>. <br />
                  Enter your email address to receive a reminder as the deadline approaches.
                </p>
                <Input
                  placeholder="Enter your email address"
                  type="email"
                  {...register("email", { required: true })}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onClick={onClose}>
                  Cancel
                </Button>
                <Button color="primary" variant="flat" type="submit">
                  Set Reminder
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default OfferPage;
