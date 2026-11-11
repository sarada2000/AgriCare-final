// Pictures for diseases, pests, weeds and weedicide bottles.
// A real photo from the website's img folders (on the server) is shown when it exists;
// otherwise the drawing bundled in the app (assets/data/<kind>/<id>.svg) is shown.
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'api.dart';
import 'content.dart';
import 'widgets.dart';

const _diseaseDrawings = {
  'blast', 'bacterial_leaf_blight', 'brown_spot', 'sheath_blight', 'tungro', 'red_stripe', 'healthy', 'normal',
  'bacterial_leaf_streak', 'bacterial_panicle_blight', 'downy_mildew', 'hispa', 'rice_panicle_blast', 'dead_heart',
};

const _weedicidePhotos = {'diuron', 'facet', 'mcpa', 'profit', 'solito'};

/// Photo file names the website uses in img/diseases (pages/diseases.js -> DISEASE_PHOTOS).
const _photoNames = {
  'blast': ['paddy blast.jpg', 'Paddy blast.jpg'],
  'bacterial_leaf_blight': ['bacterial leaf blight.jpg', 'Bacterial leaf blight.jpg'],
  'brown_spot': ['Brown spot.jpg', 'brown spot.jpg'],
  'sheath_blight': ['sheath blight.jpg', 'Sheath blight.jpg'],
  'tungro': ['tungro.jpg', 'Tungro.jpg'],
  'red_stripe': ['red stripe.jpg', 'Red stripe.jpg'],
  'gall_midge': ['gall midge.jpg', 'Gall midge.jpg'],
  'leaf_folder': ['leaf folder.jpg', 'Leaf folder.jpg'],
  'paddy_bug': ['rice bug.jpg', 'Rice bug.jpg'],
  'stem_borer': ['stem borer.jpg', 'Stem borer.jpg'],
};

List<String> _serverUrls(String folder, List<String> names) {
  final base = Api.instance.baseUrl;
  if (base.isEmpty) return const [];
  return [for (final n in names) '$base/img/$folder/${Uri.encodeComponent(n)}'];
}

List<String> diseasePhotoUrls(String id) =>
    _serverUrls('diseases', [...?_photoNames[id], '$id.jpg', '$id.png']);

/// Photos of a pest: img/pests/<id>.jpg, then the names the website uses in img/diseases.
List<String> pestPhotoUrls(String id) => [..._serverUrls('pests', ['$id.jpg']), ...diseasePhotoUrls(id)];

/// Shows the first photo that loads from [urls]; shows [fallback] while loading or when none exists.
class PhotoOr extends StatelessWidget {
  final List<String> urls;
  final Widget fallback;
  final BoxFit fit;
  const PhotoOr({super.key, required this.urls, required this.fallback, this.fit = BoxFit.cover});

  static final Set<String> _missing = {};   // photos that are not on the server (not asked again)

  @override
  Widget build(BuildContext context) {
    final list = urls.where((u) => !_missing.contains(u)).toList();
    return _try(list, 0);
  }

  Widget _try(List<String> list, int i) {
    if (i >= list.length) return fallback;
    final url = list[i];
    return Image.network(
      url,
      fit: fit,
      width: double.infinity,
      height: double.infinity,
      frameBuilder: (context, child, frame, sync) => (frame == null && !sync) ? fallback : child,
      errorBuilder: (context, error, stack) {
        _missing.add(url);
        return _try(list, i + 1);
      },
    );
  }
}

Widget _svg(String path) => SvgPicture.asset(
      path,
      fit: BoxFit.cover,
      width: double.infinity,
      height: double.infinity,
      placeholderBuilder: (_) => Container(color: AppColors.surface2),
    );

Widget _iconBox(String id) {
  final c = DiseaseAvatar.colorFor(id);
  return Container(
    color: c.withValues(alpha: 0.16),
    alignment: Alignment.center,
    child: Icon(id == 'healthy' ? Icons.eco : Icons.coronavirus_outlined, color: c),
  );
}

/// Drawing of a disease, pest or the healthy leaf (no photo).
Widget diseaseDrawing(String id) {
  if (_diseaseDrawings.contains(id)) return _svg('assets/data/diseases/$id.svg');
  if (Content.instance.pest(id) != null) return _svg('assets/data/pests/$id.svg');
  return _iconBox(id);
}

/// Picture of a disease or pest: the real photo from the server when there is one, else the drawing.
class DiseasePicture extends StatelessWidget {
  final String id;
  final double? height;
  final double radius;
  const DiseasePicture(this.id, {super.key, this.height, this.radius = 16});

  @override
  Widget build(BuildContext context) {
    final urls = Content.instance.pest(id) != null ? pestPhotoUrls(id) : diseasePhotoUrls(id);
    return ClipRRect(
      borderRadius: BorderRadius.circular(radius),
      child: SizedBox(
        height: height,
        width: double.infinity,
        child: PhotoOr(urls: urls, fallback: diseaseDrawing(id)),
      ),
    );
  }
}

/// Picture of a weed (photo at img/weeds/<id>.jpg on the server, else the drawing).
class WeedPicture extends StatelessWidget {
  final String id;
  final double? height;
  final double radius;
  const WeedPicture(this.id, {super.key, this.height, this.radius = 14});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(radius),
      child: SizedBox(
        height: height,
        width: double.infinity,
        child: PhotoOr(
          urls: _serverUrls('weeds', ['$id.jpg', '$id.png']),
          fallback: _svg('assets/data/weeds/$id.svg'),
        ),
      ),
    );
  }
}

/// Weedicide bottle photo (from the website's img/weedicides), else a coloured label with the group code.
class BottlePicture extends StatelessWidget {
  final String id;
  final String code;
  final Color color;
  final double width, height;
  const BottlePicture(this.id, this.code, this.color, {super.key, this.width = 64, this.height = 84});

  @override
  Widget build(BuildContext context) {
    final box = Container(
      width: width,
      height: height,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(12)),
      child: Text(code, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 18)),
    );
    if (!_weedicidePhotos.contains(id)) return box;
    return Stack(children: [
      ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: width,
          height: height,
          color: Colors.white,
          child: Image.asset('assets/data/weedicides/$id.jpg', fit: BoxFit.contain, errorBuilder: (_, __, ___) => box),
        ),
      ),
      Positioned(
        right: 4,
        bottom: 4,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
          decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(5)),
          child: Text(code, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 10)),
        ),
      ),
    ]);
  }
}
