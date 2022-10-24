const axios = require(‘axios’);
const qs = require(‘qs’);
const signIn = async (req, res, next) => {
  const OAUTH_TOKEN_API_URL = ‘https://kauth.kakao.com/oauth/token’;
  const GRANT_TYPE = ‘authorization_code’;
  const CLIENT_ID = ‘2e091f18c81ea075f7e01186b8a24d09’;
  const REDIRECT_URL = ‘http://localhost:3000/user/signin’; //여기도 프론트 통신과 셀프통신 시 달라짐
  let ACCESS_TOKEN;
  const { code } = req.query;
  console.log(‘CODE: ’ + code);
  await axios
    .post(
      `${OAUTH_TOKEN_API_URL}`,
      qs.stringify({
        grant_type: GRANT_TYPE,
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URL,
        code: code,
      }),
      {
        headers: {
          ‘Content-Type’: ‘application/x-www-form-urlencoded; charset=utf-8’,
        },
      }
    )
    .then((result) => {
      ACCESS_TOKEN = result.data.access_token;
      console.log(‘TOKEN: ’ + result.data.access_token);
      console.log(result.data);
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
  await axios
    .get(‘https://kapi.kakao.com/v2/user/me’, {
      headers: {
        ‘Content-Type’: ‘application/x-www-form-urlencoded; charset=utf-8’,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
    .then((res) => {
      console.log(res);
    });
  await axios
    .post(
      `https://nid.naver.com/oauth2.0/token`,
      qs.stringify({
        grant_type: ‘authorization_code’,
        client_id: ‘M7RqsEOvkI7Fb33qpPnq’,
        client_secret: ‘p87VetJeBY’,
        state: ‘cosegu’,
        code: code,
      }),
      {
        headers: {
          ‘Content-Type’: ‘application/x-www-form-urlencoded; charset=utf-8’,
        },
      }
    )
    .then((response) => {
      ACCESS_TOKEN = response.data.access_token;
      console.log(response);
    });
  await axios
    .get(‘https://openapi.naver.com/v1/nid/me’, {
      headers: {
        ‘Content-Type’: ‘application/x-www-form-urlencoded; charset=utf-8’,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
    .then((res) => {
      console.log(res);
    });
};
module.exports = {
  signIn,
};