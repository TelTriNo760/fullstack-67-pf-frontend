import { FC, useState } from "react";
import { TodoItem } from "../types";
import axios from "axios";

interface Props {
  item:TodoItem;
  formatDateTime(dateStr: string) : {date:string,time:string};
  expandedTodoIds:string[];
  toggleAccordion(id: string) : void;
  handleDelete(id:string) : void;
  fetchData() : void;
}



export const Todo: FC<Props> = ({item,formatDateTime,expandedTodoIds,toggleAccordion,handleDelete,fetchData}) => {
    const { date, time } = formatDateTime(item.createdAt);
    const isExpanded = expandedTodoIds.includes(item.id);
    const [isEdit,setIsEdit] = useState(false);
    const [Title,setTitle] = useState(item.todoText);
    const [Description,setDescription] = useState(item.description);

    function handleEditClick() {
      setIsEdit(!isEdit);
    }

    function handleSubmit() {
        axios
          .request({
            url: "/api/todo",
            method: "patch",
            data: { id: item.id, todoText: Title , description : Description},
          })
          .then(fetchData)
          .catch((err) => alert(err));
    }

    return (
      <article
        onClick={() => toggleAccordion(item.id)}
        key={item.id}
        style={{ cursor: "pointer" }}
        className="flex-cols backdrop-blur-sm bg-white/20 space-between m-5 hover:scale-105 transition duration-200 ease-in-out"
      >
        <div className="flex justify-stretch items-center w-full gap-2 text-white">
          <div className="text-xs flex-none">
            {date} {time}
          </div>
          {/* <div className="w-1/3 ml-2 flex-1">
            <Progress progress={10} color="blue" />
          </div> */}
          <div className="flex-none">
            {isExpanded ? (
              <svg
                data-accordion-icon
                className="w-3 h-3 rotate-360 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            ) : (
              <svg
                data-accordion-icon
                className="w-3 h-3 rotate-180 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            )}
          </div>
        </div>
        <div className="text-xl text-white" data-cy="todo-item-text" 
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {isEdit ? <input value={Title} onChange={(e) => {setTitle(e.target.value)}} /> :  Title}
        </div>

        {isExpanded && (
          <div className="p-1">
            <div className="text-white"
            onClick={(e) => {
              e.stopPropagation();
            }}
            >
              {isEdit ? <textarea value={Description} onChange={(e) => {setDescription(e.target.value)}}/> :  Description}
            </div>
            <div className="flex justify-end items-end gap-2 w-full">
              <div
                onClick={(e) => {
                  handleEditClick(); 
                  e.stopPropagation();
                  isEdit && handleSubmit();
                }}
                className="cursor-pointer"
              >
                <button className="text-sm px-2 py-1 bg-blue-600 border-none backdrop-blur-sm "
                >
                  {isEdit ? "OK" : "Edit"}
                </button>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => handleDelete(item.id)}
                data-cy="todo-item-delete"
              >
                <button className="text-sm px-2 py-1 bg-red-600 border-none backdrop-blur-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </article>
    );
};

