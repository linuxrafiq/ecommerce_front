import { API } from "../config";

export const createAiUser = (next) => {
  return fetch(`${API}/ai-user`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((responce) => {
      return responce.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
export const signup = (user) => {
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((responce) => {
      return responce.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const profileUpdate = (user) => {
  return fetch(`${API}/profile/update`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((responce) => {
      return responce.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const verifyOtp = (user) => {
  return fetch(`${API}/verfiy-otp`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((responce) => {
      return responce.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const resendOtp = (user) => {
  return fetch(`${API}/resend-otp`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((responce) => {
      return responce.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const signin = (user) => {
  return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((responce) => {
      return responce.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

// export const authenticate = (data, next)=>{
//     if (typeof window !== 'undefined'){
//         localStorage.setItem('jwt', JSON.stringify(data));
//         next();
//     }
// }

export const signout = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    next();

    return fetch(`${API}/signout`, {
      method: "GET",
    })
      .then((responce) => {
        console.log("signout", responce);
      })
      .catch((err) => console.log(err));
  }
};

// export const isAuthenticated = () =>{
//     if (typeof window == 'undefined'){
//         return false;
//     }
//     if (localStorage.getItem('jwt')){
//         return JSON.parse(localStorage.getItem('jwt'))
//     }else{
//         return false;
//     }
// }
