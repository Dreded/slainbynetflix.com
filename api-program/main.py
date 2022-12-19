import re
import unicodedata
from os.path import exists
from tmdbv3api import TMDb
from tmdbv3api import Movie
from tmdbv3api import TV
import config

tmdb = TMDb()
tmdb.api_key = config.api_key


movie = Movie()
tv = TV()

path_to_content = "../content/shows/"

def slugify(value, allow_unicode=False):
    """
    Taken from https://github.com/django/django/blob/master/django/utils/text.py
    Convert to ASCII if 'allow_unicode' is False. Convert spaces or repeated
    dashes to single dashes. Remove characters that aren't alphanumerics,
    underscores, or hyphens. Convert to lowercase. Also strip leading and
    trailing whitespace, dashes, and underscores.
    """
    value = str(value)
    if allow_unicode:
        value = unicodedata.normalize('NFKC', value)
    else:
        value = unicodedata.normalize('NFKD', value).encode(
            'ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value.lower())
    return re.sub(r'[-\s]+', '-', value).strip('-_') + ".md"


def out_to_file(show):
    genres = []
    runtime = []
    created_by = []
    avg_runtime = 0
    us_rating = ''
    for each in show.created_by:
        created_by.append(each.name)
    for each in show.genres:
        genres.append(each.name)

    for each in show.episode_run_time:
        runtime.append(each)
    for each in runtime:
        avg_runtime += each
    if len(runtime) > 1:
        avg_runtime /= len(runtime)

    with open(path_to_content + slugify(show.name), 'w') as f:
        print("---", file=f)
        print("title: \"{}\"".format(show.name), file=f)
        print("id:", show.id, file=f)
        print("tagline: \"{}\"".format(show.tagline.replace("\"", "'")), file=f)
        print("status:", show.status, file=f)
        print("in_production:", show.in_production, file=f)
        print("first_air_date:", show.first_air_date, file=f)
        print("last_air_date:", show.last_air_date, file=f)
        print("date:", show.last_air_date, file=f)
        print("number_of_seasons:", show.number_of_seasons, file=f)
        print("number_of_episodes:", show.number_of_episodes, file=f)
        print("genres: ", genres, file=f)
        print("avg_runtime :", avg_runtime, file=f)
        print("creators:", created_by, file=f)
        print("poster_path: \"{}\"".format(show.poster_path), file=f)
        print("vote_average:", round(show.vote_average*10), file=f)
        print("us_rating: \"{}\"".format(us_rating), file=f)
        print("summary: \"{}\"".format(show.overview.replace("\"", "'")), file=f)
        print("---\n", file=f)

def get_data_from_file(name):
    slug = slugify(name)
    path = path_to_content + slug
    show_exists = exists(path)
    data = {}

    if not show_exists:
        print("Cannot find: ", path)
        return False

    lines = []
    with open(path, 'r') as f:
        lines = f.readlines()
    
    for line in lines:
        if len(line) < 6:
            continue
        splitLine = line.split(':')
        data[splitLine[0].strip()] = splitLine[1].strip()
        
    return data

def show_lookup_by_id(id, from_file_id = False):
    netflix_show = from_file_id
    show = tv.details(id, "content_ratings")

    if not netflix_show:
        for each in show.networks:
            if each.name == 'Netflix':
                netflix_show = True
        # check homepage url as somehows don't have the networks listed
        if not netflix_show:
            if 'www.netflix.com/' in show.homepage:
                print("Found: {} by homepage URL".format(show.name))
                netflix_show = True
        
    for each in show.content_ratings.results:
        if each.iso_3166_1 == 'US':
            us_rating = each.rating
    if netflix_show:
        print("Processing: ", show.name)
        out_to_file(show)
    else:
        not_found.append(show.name)

# recommendations = movie.recommendations(movie_id=111)

# for recommendation in recommendations:
#     print(recommendation.title)
#     print(recommendation.overview)


my_file = open("test-list.txt", "r")
data = my_file.read()
show_list = data.split("\n")
my_file.close()

not_found = []

for show in show_list:
    data = get_data_from_file(show)
    if not data:
        print("No File for show:", show)
        show_query = tv.search(show)

        for result in show_query:
            if result.name != show:
                if (len(not_found) > 1) and (not_found[-1] != show):
                    not_found.append(show)
                continue
            show_lookup_by_id(result.id)
    else:
        #lookup using the id from the file
        show_lookup_by_id(int(data['id']), True)


# TODO:
# count how many of the exact same show is found.

if (len(not_found)):
    print("\n\nShows Not Found")
    print("-----------------------------------")
    for each in not_found:
        print(each)
