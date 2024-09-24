import { axios } from "@/lib";

export const offersApi = {
  getOffers: async ({
    university,
    speciality,
    semester,

    searchTerm,
    country,
    city,
    duration,
    category,
    language
  }: any) => {
    const { data } = await axios.get("/offers", {
      params: {
        university,
        speciality,
        semester,
        
        searchTerm,
        country,
        city,
        duration,
        category,
        language
      }
    });
    console.log(data);
    console.log(duration);
    return data;
  },
  getOfferById: async (id: string) => {
    const { data } = await axios.get(`/offers/${id}`);
    return data;
  },
  getSpecializationById: async (id: string, { specialization_id, sem }: any) => {
    const { data } = await axios.get(`/specializations/${id}`, {
      params: {
        specialization_id,
        sem
      }
    });
    return data;
  }
};
