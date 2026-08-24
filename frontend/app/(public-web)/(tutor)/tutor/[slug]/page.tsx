import { TutorProfileClient } from "./_sections/tutor-profile-client"

interface PageProps {
  params: { slug: string }
}

export default async function TutorDetailPage({ params }: PageProps) {
  const { slug } = await params
  
  // Extract id from slug (e.g., "nguyen-van-a-123" -> 123)
  const idSuffix = slug.split("-").pop()
  const tutorId = idSuffix ? Number(idSuffix) : NaN

  if (isNaN(tutorId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            URL không hợp lệ
          </h2>
          <p className="text-muted-foreground">
            Thông tin gia sư không đúng định dạng.
          </p>
        </div>
      </div>
    )
  }

  return <TutorProfileClient tutorId={tutorId} />
}