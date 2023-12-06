import category from "../../../backend/models/category";

const book = ({ details }) => {
  console.log(details);

  return (
    <>
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-center min-h-screen">
          <div class="max-w-sm w-full sm:w-1/2 lg:w-1/3 py-6 px-3">
            <div class="bg-white shadow-xl rounded-lg overflow-hidden">
              <div class="flex justify-end"></div>
            </div>
            <div class="p-4">
              <p class="uppercase tracking-wide text-sm font-bold text-gray-700">
                <p class="text-3xl text-gray-900">{details.bookName}</p>
                {details.author} • {details.publicationYear}
              </p>
              <p class="text-gray-700">{details.bookDescription}</p>
            </div>
            <div class="flex p-4 border-t border-gray-300 text-gray-700">
              <div class="flex-1 inline-flex items-center">
                <p>
                  <span class="text-gray-900 font-bold">
                    {details.availableCopies}
                  </span>{" "}
                  Available Copies
                </p>
              </div>
              <div class="flex-1 inline-flex items-center">
                <p>
                  <span class="text-gray-900 font-bold">
                    {details.category}
                  </span>
                </p>
              </div>
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Button
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default book;
