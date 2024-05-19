import { commonApi } from "@/api";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  university: string;
  specialization: string;
  semester: number;
};

const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

export const StudentModal = ({
  open,
  onClose,
  onOpenChange
}: {
  open: boolean;
  onClose: any;
  onOpenChange: any;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch
  } = useForm<FormData>({
    mode: "onChange"
  });

  const { data: universities } = useQuery({
    queryKey: ["universities"],
    queryFn: () => commonApi.getUniversities(),
  });

  const { data: specializations } = useQuery({
    queryKey: ["specializations", watch("university")],
    queryFn: () => commonApi.getSpecializationsByUniversity(watch("university")),
    enabled: !!watch("university")
  });

  const onSubmit = (data: any) => {
    const studentData = {
      university: {
        id: data.university,
        name: universities.find((u) => u.university_id === data.university)?.university_name
      },
      specialization: {
        id: data.specialization,
        name: specializations.find((s: any) => s.specialization_id === data.specialization)
          ?.specialization_name
      },
      semester: data.semester.toString()
    };

    localStorage.setItem("student", JSON.stringify(studentData));
    // trigger reload
    window.location.reload();
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Are you a student?</ModalHeader>
            <ModalBody>
              <p className="mb-4 text-sm">
                If you are a student in Moldova, you can provide more details to get more
                personalized opportunities.
              </p>

              <div>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <Select
                      size="sm"
                      label="University"
                      className="w-full"
                      onChange={(e) => {
                        // console.log(filter.options);
                        // the value is the index of the keys
                        const value = universities?.[parseInt(e.target.value)]?.university_id;
                        // console.log(value, Object.keys(filter.options));
                        field.onChange(value);
                      }}
                      value={field.value as string}
                    >
                      {universities?.map((option: any, index: number) => (
                        <SelectItem key={index} value={option.university_id}>
                          {option.university_name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                  {...{
                    ...register("university"),
                    ref: null
                  }}
                />

                <Controller
                  control={control}
                  disabled={!!!watch("university")}
                  render={({ field }) => (
                    <Select
                      size="sm"
                      label="Specialization"
                      className="mt-4 w-full"
                      onChange={(e) => {
                        // console.log(filter.options);
                        // the value is the index of the keys
                        const value = specializations?.[parseInt(e.target.value)]?.specialization_id;
                        // console.log(value, Object.keys(filter.options));
                        field.onChange(value);
                      }}
                      value={field.value as string}
                      isDisabled={!watch("university")}
                    >
                      {specializations?.map((option: any, index: number) => (
                        <SelectItem key={index} value={option.specialization_id}>
                          {option.specialization_name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                  {...{
                    ...register("specialization"),
                    ref: null
                  }}
                />

                <Controller
                  control={control}
                  disabled={!!!watch("specialization")}
                  render={({ field }) => (
                    <Select
                      size="sm"
                      label="Semester"
                      className="mt-4 w-full"
                      onChange={(value) => field.onChange(value)}
                      value={field as any}
                      isDisabled={!watch("specialization")}
                    >
                      {semesters.map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option.toString()}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                  {...{
                    ...register("semester"),
                    ref: null
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};