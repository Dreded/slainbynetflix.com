#include <curl/curl.h>
#include <iostream>
#include <string>

std::string API_key = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YWRkYzhmNGQyNDY3MmRmOGE4OTdkYzFkNTBiZWVkZCIsInN1YiI6IjVkYzMzODJkN2Q1ZGI1MDAxOTliZDI0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AOWShOLdfEAADS_mXUgcVPKABnoDheeNHWWvC6yAvuw";
// curl --request GET \
//   --url 'https://api.themoviedb.org/3/movie/76341' \
//   --header 'Authorization: Bearer <<access_token>>' \
//   --header 'Content-Type: application/json;charset=utf-8'

static size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp)
{
    ((std::string *)userp)->append((char *)contents, size * nmemb);
    return size * nmemb;
}

int main()
{
    CURL *curl;
    CURLcode res;
    std::string readBuffer;
    curl = curl_easy_init();
    if (curl)
    {
        curl_easy_setopt(curl, CURLOPT_URL, "https://api.themoviedb.org/3/movie/76341");
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
        res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);

        std::cout << readBuffer << std::endl;
    }
    return 0;
}