import axios from "axios";

export const port = process.env.PORT || 3000;

export const baseURL4Real =
	process.env.NODE_ENV === "development"
		? "http://localhost:3000/api"
		: "https://weather-final-project.herokuapp.com/api";
export const api = axios.create({
	baseURL: baseURL4Real,
});

// user requests.
export const insertUser = (payload) => api.post("/user", payload);
export const getAllUsers = () => api.get("/users");
export const updateUserById = (id, payload) => api.put(`/user/${id}`, payload);
export const deleteUserById = (id) => api.delete(`/user/${id}`);
export const getUserById = (id) => api.get(`/user/${id}`);
export const connectUser = (payload) => api.post("/sign-in", payload);
export const tokenIsValid = (payload) =>
	api.post("/tokenIsValid", null, {
		headers: { "x-auth-token": payload.token },
	});
export const getUserByIdAfterAuth = (payload) =>
	api.get("/", { headers: { "x-auth-token": payload.token } });

// city requests.
export const insertCity = (payload) => api.post("/city", payload);
export const getAllCities = () => api.get("/cities");
export const deleteCityById = (id) => api.delete(`/city/${id}`);
export const getCityById = (id) => api.get(`/city/${id}`);

// favorite requests.
export const getFavoritesByUserId = (userId) => api.get(`/favorite/${userId}`);
export const updateFavorite = (userId, payload) =>
	api.put(`/favorite/${userId}`, payload);

const apis = {
	//getCookieUser,
	insertUser,
	getAllUsers,
	updateUserById,
	deleteUserById,
	getUserById,
	connectUser,
	tokenIsValid,
	getUserByIdAfterAuth,
	insertCity,
	getAllCities,
	deleteCityById,
	getCityById,
	getFavoritesByUserId,
	updateFavorite,
	port,
	baseURL4Real,
};

export default apis;
