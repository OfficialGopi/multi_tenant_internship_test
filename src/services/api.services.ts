const getUser = async () => {
  let user = await (
    await fetch(`/api/auth/me`, {
      credentials: "include",
      method: "POST",
    })
  ).json();

  if (user.success) {
    return user.data;
  }

  let refreshAccessTokenResponse = await (
    await fetch(`/api/auth/refresh-access-token`, {
      method: "PUT",
    })
  ).json();

  if (refreshAccessTokenResponse.success) {
    user = await (
      await fetch(`/api/auth/me`, {
        credentials: "include",
        method: "POST",
      })
    ).json();

    if (user.success) {
      return user.data;
    }
  }

  return null;
};

export { getUser };
