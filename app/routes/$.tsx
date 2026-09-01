export function loader() {
  throw new Response(null, {status: 404});
}

export default function UnavailableRoute() {
  return null;
}
