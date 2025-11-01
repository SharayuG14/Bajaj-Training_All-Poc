import { Routes } from "@angular/router";
import { Home } from "./features/home/home";
import { ProductsList } from './features/products/components/products-list/products-list';
import { ProductDetails } from './features/products/components/product-details/product-details';
import { RegisterProduct } from './features/products/components/register-product/register-product';
import { CategoryList } from "./features/categories/components/categories-list/categories-list";
import { CategoryDetails } from "./features/categories/components/category-details/category-details";
import { RegisterCategory } from "./features/categories/components/register-category/register-category";
import { CartComponent } from "./features/cart/components/cart/cart.component";
import { OrderHistoryComponent } from "./features/orders/components/order-history/order-history.component";
import { CheckoutComponent } from "./features/checkout/components/checkout/checkout.component";
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard, adminGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
{
    path: "",
    redirectTo: "home",
    pathMatch: "full"
},
{
    path: "home",
    component: Home,
    title: "BAJAJ EP HOME"
},
{
    path: "products",
    component: ProductsList,
    title: "BAJAJ products"
},
{
    path: "products/register",
    component: RegisterProduct,
    title: "BAJAJ register product",
    canActivate: [adminGuard]
},
{
    path: "products/details/:id",
    component: ProductDetails,
    title: "BAJAJ product details"
},
{
    path: 'categories',
    component: CategoryList,
    title: "BAJAJ categories"
},
{
    path: "categories/register",
    component: RegisterCategory,
    title: "BAJAJ register category",
    canActivate: [adminGuard]
},
{
     path: "categories/:slug", 
     component: CategoryDetails, 
     title: "BAJAJ category details" 
},
{
    path: "cart",
    component: CartComponent,
    title: "BAJAJ cart"
},
{
    path: "checkout",
    component: CheckoutComponent,
    title: "BAJAJ checkout",
    canActivate: [authGuard]
},
{
    path: "orders",
    component: OrderHistoryComponent,
    title: "BAJAJ orders",
    canActivate: [authGuard]
},
{
    path: "login",
    component: LoginComponent,
    title: "Sign in"
},
{
    path: "register",
    component: RegisterComponent,
    title: "Create account"
}
]
