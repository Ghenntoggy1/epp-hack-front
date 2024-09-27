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
  }: any, token: string) => {
    const { data } = await axios.get("/offers", {
      headers: {
        Authorization: `Bearer ${token}`
      },
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
  getOfferById: async (id: string, token: string) => {
    const { data } = await axios.get(`/offers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  },
  getSpecializationById: async (id: string, { specialization_id, sem }: any, token: string) => {
    const { data } = await axios.get(`/specializations/${id}`, {
      params: {
        specialization_id,
        sem
      },
      headers: {
          Authorization: `Bearer ${token}`
      }
    });
    return data;
  }
};
