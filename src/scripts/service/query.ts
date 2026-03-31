export const BASE_PROJECTS_QUERY = `*[_type == "project" 
&& (!defined($category)|| category -> slug.current == $category)
 && (!defined($city) || city -> slug.current == $city) 
 && (!defined($status) || status == $status) 
 && (!defined($search) || searchIndex match $search + "*")]`;

export const PROJECTS_FIELDS = `{
_id, "projectName": coalesce(projectName[$locale], projectName.uk),
 "slug": slug.current,
  status,
  timeline,
  area, 
  typeOfServices[]->{"name": coalesce(name[$locale], name.uk)}, 
  category->{
    _id,
  "name": coalesce(name[$locale], name.uk),
    "slug": slug.current
  },
  city->{_id, "name": coalesce(name[$locale], name.uk), "slug": slug.current},
 "cover": cover.asset->url,
}`;

export const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]
{
_id, "projectName": coalesce(projectName[$locale], projectName.uk),
 "slug": slug.current,
"country": coalesce(country[$locale], country.uk), 
city->{_id, "name": coalesce(name[$locale], name.uk), "slug": slug.current}, 
"adress": coalesce(adress[$locale], adress.uk), 
location,
status, 
timeline, 
area, 
typeOfServices[]->{"name": coalesce(name[$locale], name.uk)},
  category->{
    _id,
  "name": coalesce(name[$locale], name.uk),
    "slug": slug.current
  },
  constructive, 
  consequenceClass,
  "description": coalesce(description[$locale], description.uk),  
  "advantages": advantages[]{"title": coalesce(title[$locale], title.uk), "description": coalesce(description[$locale], description.uk)},
  supplier[]->{ _id, "name": coalesce(name[$locale], name.uk), "location": coalesce(location[$locale], location.uk), link},
  generalDesigner->{_id, "name": coalesce(name[$locale], name.uk), "location": coalesce(location[$locale], location.uk), link},
  'partners': partners[]->{ _id, "name": coalesce(name[$locale], name.uk), "location": coalesce(location[$locale], location.uk), link, "logo": logo.asset->url},
 "award": coalesce(award[$locale], award.uk), siteUrl, 
  "cover": cover.asset->url, "schema": schema.asset->url, 
  "photo": photo[].asset->url,
  linkDocuments,
  "seo": seo{'metaTitle': coalesce(metaTitle[$locale], metaTitle.uk), 'metaDescription': coalesce(metaDescription[$locale], metaDescription.uk)}
}`;

export const NEWS_QUERY = `{
  "news": *[_type == "news"] | order(publishedAt desc)[$start...$end]
  { _id, 
   "slug": slug.current, 
   "title": coalesce(title[$locale], title.uk),
 "description": coalesce(description[$locale], description.uk),
  "images": images[0].asset->url, 
  _createdAt, _updatedAt, 
  publishedAt },
  "total": count(*[_type == "news"]),
}`;

export const NEW_QUERY = `*[_type == "news"&& slug.current == $slug][0]
{ _id, 
 "slug": slug.current, 
 "title": coalesce(title[$locale], title.uk),
 "description": coalesce(description[$locale], description.uk), 
 "images": images[].asset->url, 
 _createdAt, 
 _updatedAt, 
 publishedAt 
 }`;

export const VIDEOS_QUERY = `{
"videos": *[_type == "video"] | order(publishedAt desc)[$start...$end]
{ _id,  
 "title": coalesce(title[$locale], title.uk), 
 videoUrl, 
 cover, 
 _createdAt, 
 _updatedAt
 }, 
 "total": count(*[_type == "video"]),
 }`;

export const PARTNERS_QUERY = `*[_type == "partners"] | [$start...$end]`;

export const BASE_GROUP_BY_CATEGORY_PROJECTS_QUERY = `*[_type == "category"]{
"name": coalesce(name[$locale], name.uk),
"slug": slug.current, 
"projects": *[_type == "project" && references(^._id)] | order($order)[0]{
_id, "projectName": coalesce(projectName[$locale], projectName.uk),
 "slug": slug.current,
  status,
  timeline,
  area, 
   city->{_id, "name": coalesce(name[$locale], name.uk), "slug": slug.current},
 "cover": cover.asset->url,
}  
}`;

export const CATEGORY_QUERY = `*[_type == "category"]
 {"name": coalesce(name[$locale], name.uk),
   "slug": slug.current
 }`;

export const LEAFLET_QUERY = `*[_type == 'project']{
 "projectName": coalesce(projectName[$locale], projectName.uk),
 "slug": slug.current,
 category->{
    _id,
  "name": coalesce(name[$locale], name.uk),
    "slug": slug.current
  },
 location
}`;

export const LEAFLET_SINGLE_QUERY = `*[_type == 'project' && slug.current == $slug][0]{
 "projectName": coalesce(projectName[$locale], projectName.uk),
 category->{
  "name": coalesce(name[$locale], name.uk),
    "slug": slug.current
  },
 "slug": slug.current,
 location
}`;

export const PREVIEW_PROJECTS_QUERY = `*[_type == "project" && (!defined($currentId) || _id != $currentId)]
  | order(_id)
  [0...6] {
    _id,
    "projectName": coalesce(projectName[$locale], projectName.uk),
    "slug": slug.current,
    status,
    timeline,
    area,
    typeOfServices[]->{"name": coalesce(name[$locale], name.uk)},
    category->{
      _id,
      "name": coalesce(name[$locale], name.uk),
      "slug": slug.current
    },
    city->{_id, "name": coalesce(name[$locale], name.uk), "slug": slug.current},
    "cover": cover.asset->url
  }`;
