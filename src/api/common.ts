import { axios } from "@/lib";

export const commonApi = {
  getCountries: async () => {
    const { data } = await axios.get("/countries");
    return data;
  },
  getCities: async () => {
    const { data } = await axios.get(`/cities`);
    return data;
  },
  getCategories: async () => {
    const { data } = await axios.get("/categories");
    return data;
  },
  getUniversities: async () => {
    const { data } = await axios.get("/universities");
    return data;
  },
  getSpecializationsByUniversity: async (uniId: string) => {
    const { data } = await axios.get(`/specializations/univ_id:${uniId}`);
    return data;
  },
  getSpecializations: async (
    uniId: string,
    {
      university_id,
      speciality_id,
      semester
    }: {
      university_id: string;
      speciality_id: string;
      semester: number;
    }
  ) => {
    const { data } = await axios.get(`/specialization/${uniId}`, {
      params: {
        university_id,
        speciality_id,
        semester
      }
    });
    return data;
  },
  addOffer: async (data: OfferPostData) => {
    const response = await axios.post("/offers", data);
    return response;
  },
  getCostOfLiving: async (city_name: string, country_name: string) => {
    const encodedParams = new URLSearchParams();
    encodedParams.set("cities", `[{"name":"${city_name}","country":"${country_name}"}]`);
    encodedParams.set("currencies", '["EUR"]');

    const options = {
      method: "POST",
      url: "https://cities-cost-of-living1.p.rapidapi.com/get_cities_details_by_name",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "8e520e4a64msh4b763e6b4afa688p1b46e3jsn534c378f1f7c"
        // "X-RapidAPI-Host": "cities-cost-of-living1.p.rapidapi.com"
      },
      data: encodedParams
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
};

interface OfferPostData {
  university_sender: string;
  university_receiver: string;
  language: string;
  offer_name: string;
  description: string;
  offer_end_date: string;
  offer_start_date: string; //for application
  program_start: string;
  program_end: string;
  scholarship: string;
  specializations: {
    specialization_id: string;
    specialization_name: string;
  }[];
}
