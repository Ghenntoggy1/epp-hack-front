import { axios } from "@/lib";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export const commonApi = {
  

  getCountries: async (token: string) => {
    const { data } = await axios.get("/countries", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  },
  getCities: async (token: string) => {
    const { data } = await axios.get(`/cities`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  },
  getCategories: async (token: string) => {
    const { data } = await axios.get("/categories", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  },
  getUniversities: async (token: string) => {
    const { data } = await axios.get("/universities", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return data;
  },
  getSpecializationsByUniversity: async (uniId: string, token: string) => {
    const { data } = await axios.get(`/specializations/univ_id:${uniId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
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
    },
    token: string
  ) => {
    const { data } = await axios.get(`/specialization/${uniId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        university_id,
        speciality_id,
        semester
      }
    });
    return data;
  },
  addOffer: async (data: OfferPostData, token: string) => {
    const response = await axios.post("/offers", data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
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
