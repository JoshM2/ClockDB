function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const authCode = url.searchParams.get('code');

    const formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('client_id', 'gTRGTzLZCEbgMdXYTsSz7ogWnV1yTkLE40CFqa0YPaw');
    formData.append('client_secret', env.CLIENT_SECRET);
    formData.append('code', authCode);
    formData.append('redirect_uri', 'https://auth.clockdb.net');
    const response = await fetch('https://www.worldcubeassociation.org/oauth/token', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    const accessToken = data['access_token'];
    
    const response2 = await fetch('https://www.worldcubeassociation.org/api/v0/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    const data2 = await response2.json();

    try {
      const name = data2['me']['name'];
      const wcaid = data2['me']['wca_id'];
      const email = data2['me']['email'];
      const randomString = generateRandomString(40);
      const epoch = new Date().getTime();
      if (["2019MARR04"].includes(wcaid)) {
        var access = 2;
      }
      else {
        var access = 1;
      }
      const ps = env.db.prepare('INSERT INTO users (key,name,wcaid,email,access,created) VALUES (?,?,?,?,?,?)').bind(randomString,name,wcaid,email,access,epoch)
      await ps.all();
      return new Response(null, {
        status: 303,
        headers: {
          'Location': 'https://clockdb.net/reconstruct',
          'Set-Cookie': `auth=${randomString}; Max-Age=40000000; path=/; domain=clockdb.net; secure; HttpOnly; SameSite=Strict`
        }
      });
    } catch (error) {
      console.log(error)
      return Response.redirect("https://clockdb.net/login-error", 303)
    }
  },
};