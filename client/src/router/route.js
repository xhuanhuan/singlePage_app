import Router from './Routers.js';
import homePage from '../home/homepage.js';
import login from '../login/login.js';
import register from '../register/register.js';
import logout from '../logout/logout.js';
import post from '../post/post.js';

var route=new Router();
route.init();

route.route('/', homePage);
route.route('/login', login);
route.route('/register', register);
route.route('/logout', logout);
route.route('/post', post);
export default route;
