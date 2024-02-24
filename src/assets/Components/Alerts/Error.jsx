import 'animate.css';

export const Alert = ({message}) =>{
    return(
        <div
  role="alert"
  className="rounded animate__animated animate__backInDown fixed top-10 left-10 w-[70vw] alert alert-error flex justify-center items-center"
>
  <div className="flex items-center gap-2 text-red-800 dark:text-red-100">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path
        fillRule="evenodd"
        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
    </svg>

    <strong className="block text-xl font-medium"> Something went wrong </strong>
  </div>

  <p className=" text-xl text-red-700 dark:text-red-200">
   {message}
  </p>
</div>
    )
}