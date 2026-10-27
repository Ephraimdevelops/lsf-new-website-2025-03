import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function SaadaReadiness() {
  const data = useQuery(api.sara.getReadiness);
  const services = useQuery(api.justiceServices.listPublicServices, {});
  const paralegals = useQuery(api.paralegals.listApprovedParalegals, {});
  if (!data) return <p role="status">Checking assistant data readiness…</p>;
  return (
    <section
      data-testid="saada-readiness"
      className="mb-8 space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-5"
    >
      <h2 className="text-lg font-semibold">What Haki Yangu AI can use now</h2>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        {[
          [
            "Private PDF originals (not live knowledge)",
            data.privatePdfOriginals,
          ],
          ["Indexed source documents", data.indexedSourceDocuments],
          [
            "Approved, current legal sources",
            data.approvedCurrentSourceDocuments,
          ],
          ["Approved, current rights guides", data.approvedCurrentGuides],
          ["Guides awaiting review", data.pendingGuides],
          ["Private directory research records", data.privateDirectoryResearch],
          [
            "Public services with current review",
            services?.length ?? "Checking…",
          ],
          ["Public eligible paralegals", paralegals?.length ?? "Checking…"],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd className="text-xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm">
        Saving research files does not index or approve them. Legal answers
        require indexed, approved sources or approved guides. Provider
        recommendations require eligible public directory records. Published
        information links are labelled separately and do not establish intake or
        referral availability.
      </p>
      {data.failedSourceDocuments > 0 && (
        <p className="text-sm font-medium">
          {data.failedSourceDocuments} source document(s) need indexing
          recovery.
        </p>
      )}
      {data.countsAreLowerBounds && (
        <p className="text-sm">
          Counts are bounded to the first 200 records per research collection;
          use the management lists for the full queue.
        </p>
      )}
    </section>
  );
}
