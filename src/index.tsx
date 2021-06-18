import React from "react";
import ReactDOM from "react-dom";
import Counter from "@/components/Counter";
import TodoList from "@/components/todo";
import Blob from "@/components/blob";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { Button } from "antd";
import "antd/dist/antd.css";
import "./index.css";
ReactDOM.render(
    <BrowserRouter>
        <div className="app-wrapper">
            <div className="app-wrapper-top">
                <Button>
                    <Link to="/couter">axios 测试</Link>
                </Button>
                <Button>
                    <Link to="/todolist">购物车</Link>
                </Button>
                <Button>
                    <Link to="/blob">Blob 文件上传</Link>
                </Button>
            </div>
            <div className="app-wrapper-bottom">
                <Route path="/couter" component={Counter} />
                <Route path="/todolist" component={TodoList} />
                <Route path="/blob" component={Blob} />
            </div>
        </div>
    </BrowserRouter>,
    document.querySelector("#root")
);
